import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

interface StripeSession {
  id: string;
  customer?: string;
  subscription?: string;
  client_reference_id?: string;
  customer_details?: {
    email?: string;
    name?: string;
  };
  metadata?: Record<string, string>;
  payment_status?: string;
  amount_total?: number;
}

interface StripeEvent {
  id: string;
  type: string;
  created: number;
  data: {
    object: Record<string, any>;
  };
}

/**
 * Validates Stripe signature header using native Node crypto HMAC-SHA256.
 * Completely decoupled: Zero external Stripe npm dependencies required.
 */
function verifyStripeSignature(
  payload: string,
  signatureHeader: string | null,
  secret: string
): boolean {
  if (!signatureHeader || !secret) return false;

  try {
    const items = signatureHeader.split(',');
    let timestamp: string | undefined;
    const signatures: string[] = [];

    for (const item of items) {
      const [key, value] = item.trim().split('=');
      if (key === 't') {
        timestamp = value;
      } else if (key === 'v1') {
        signatures.push(value);
      }
    }

    if (!timestamp || signatures.length === 0) return false;

    // Check tolerance (5 minutes)
    const currentTime = Math.floor(Date.now() / 1000);
    const eventTime = parseInt(timestamp, 10);
    if (Math.abs(currentTime - eventTime) > 300) {
      return false;
    }

    const signedPayload = `${timestamp}.${payload}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload, 'utf8')
      .digest('hex');

    // Constant-time buffer comparison to prevent timing attacks
    const expectedBuf = Buffer.from(expectedSignature, 'hex');
    return signatures.some((sig) => {
      try {
        const sigBuf = Buffer.from(sig, 'hex');
        return sigBuf.length === expectedBuf.length && crypto.timingSafeEqual(sigBuf, expectedBuf);
      } catch {
        return false;
      }
    });
  } catch (err) {
    console.error('[Stripe Webhook] Signature verification error:', err);
    return false;
  }
}

/**
 * Updates a user's subscription record in Supabase using Service Role credentials.
 */
async function updateUserSubscription(data: {
  userId?: string;
  email?: string;
  tier: string;
  status: string;
  customerId?: string;
  subscriptionId?: string;
}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.log('[Stripe Webhook] Supabase credentials not set; simulation mode recorded.', data);
    return { success: true, simulated: true };
  }

  try {
    const filter = data.userId ? `id=eq.${data.userId}` : `email=eq.${data.email}`;
    const patchBody = {
      subscription_tier: data.tier,
      subscription_status: data.status,
      stripe_customer_id: data.customerId,
      stripe_subscription_id: data.subscriptionId,
      updated_at: new Date().toISOString(),
    };

    const res = await fetch(`${supabaseUrl}/rest/v1/users?${filter}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(patchBody),
    });

    if (!res.ok) {
      console.warn('[Stripe Webhook] Supabase update warning:', res.status, await res.text());
      return { success: false, status: res.status };
    }

    return { success: true };
  } catch (err) {
    console.error('[Stripe Webhook] Database update error:', err);
    return { success: false, error: String(err) };
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature');
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    // Verify webhook signature if secret is provisioned
    if (secret) {
      const isValid = verifyStripeSignature(rawBody, signature, secret);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid Stripe webhook signature' },
          { status: 400 }
        );
      }
    } else {
      console.warn('[Stripe Webhook] WARNING: STRIPE_WEBHOOK_SECRET not set; running in permissive development mode');
    }

    const event: StripeEvent = JSON.parse(rawBody);

    console.log(`[Stripe Webhook] Processing event: ${event.type} (${event.id})`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as StripeSession;
        const email = session.customer_details?.email || session.metadata?.email;
        const userId = session.client_reference_id || session.metadata?.userId;
        const plan = session.metadata?.plan || 'Pro';

        await updateUserSubscription({
          userId,
          email,
          tier: plan,
          status: 'active',
          customerId: session.customer,
          subscriptionId: session.subscription,
        });

        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const status = sub.status; // 'active', 'past_due', 'trialing', 'canceled'
        const customerId = sub.customer;

        await updateUserSubscription({
          customerId,
          tier: status === 'active' ? 'Pro' : 'Free',
          status,
          subscriptionId: sub.id,
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const customerId = sub.customer;

        // Downgrade to Free tier upon cancellation
        await updateUserSubscription({
          customerId,
          tier: 'Free',
          status: 'canceled',
          subscriptionId: sub.id,
        });
        break;
      }

      case 'invoice.payment_succeeded': {
        // Telemetry logging for recurring monthly/annual recurring subscription renewals
        console.log(`[Stripe Webhook] Invoice payment succeeded for customer ${event.data.object.customer}`);
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({
      received: true,
      event: event.type,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[Stripe Webhook] Error handling webhook payload:', err);
    return NextResponse.json(
      { error: 'Internal Server Error', message: err?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
