/**
 * DECOUPLED BILLING & PAYMENT GATEWAY ARCHITECTURE
 * 
 * Supports 100% decoupled payment links:
 * - Stripe Payment Links (https://buy.stripe.com/...)
 * - Lemon Squeezy Checkout (https://yourstore.lemonsqueezy.com/checkout/buy/...)
 * - Polar.sh / Paddle
 * 
 * When unconfigured, the application runs in local demo sandbox mode without breaking.
 */

export interface BillingConfig {
  stripeProLink?: string;
  stripeStudioLink?: string;
  lemonSqueezyProUrl?: string;
  lemonSqueezyStudioUrl?: string;
  customerPortalUrl?: string;
  isConfigured: boolean;
}

export function getBillingConfig(): BillingConfig {
  const stripePro = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_PRO;
  const stripeStudio = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_STUDIO;
  const lemonPro = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_URL_PRO;
  const lemonStudio = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_URL_STUDIO;
  const portal = process.env.NEXT_PUBLIC_BILLING_PORTAL_URL;

  const isConfigured = Boolean(
    (stripePro && !stripePro.includes('placeholder')) ||
    (lemonPro && !lemonPro.includes('placeholder'))
  );

  return {
    stripeProLink: stripePro,
    stripeStudioLink: stripeStudio,
    lemonSqueezyProUrl: lemonPro,
    lemonSqueezyStudioUrl: lemonStudio,
    customerPortalUrl: portal,
    isConfigured,
  };
}

/**
 * Returns the active checkout URL for a given tier, prefilling the user's email
 */
export function getCheckoutUrl(
  tier: 'Free' | 'Pro' | 'Creator',
  userEmail?: string
): { isConfigured: boolean; url: string | null } {
  const config = getBillingConfig();

  if (tier === 'Free') {
    return { isConfigured: false, url: null };
  }

  let baseUrl: string | undefined;

  if (tier === 'Pro') {
    baseUrl = config.stripeProLink || config.lemonSqueezyProUrl;
  } else if (tier === 'Creator') {
    baseUrl = config.stripeStudioLink || config.lemonSqueezyStudioUrl || config.stripeProLink;
  }

  if (!baseUrl || baseUrl.includes('placeholder') || !baseUrl.startsWith('http')) {
    return { isConfigured: false, url: null };
  }

  try {
    const urlObj = new URL(baseUrl);
    if (userEmail && userEmail.includes('@') && !userEmail.includes('example.com')) {
      // Stripe uses prefilled_email, Lemon Squeezy uses checkout[email]
      if (baseUrl.includes('stripe.com')) {
        urlObj.searchParams.set('prefilled_email', userEmail);
      } else if (baseUrl.includes('lemonsqueezy.com')) {
        urlObj.searchParams.set('checkout[email]', userEmail);
      }
    }
    return { isConfigured: true, url: urlObj.toString() };
  } catch {
    return { isConfigured: false, url: null };
  }
}
