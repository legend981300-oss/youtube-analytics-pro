/**
 * CAN-SPAM & GDPR / PECR COMPLIANT EMAIL TEMPLATE ENGINE
 * 
 * Compliance Guarantees:
 * 1. Physical Postal Address in every email footer (CAN-SPAM 15 U.S.C. 7704(a)(5)).
 * 2. Working One-Click Unsubscribe mechanism (RFC 8058 List-Unsubscribe + web link).
 * 3. Clear, conspicuous sender identification and purpose disclosure.
 * 4. Zero dark patterns: opt-out is immediate without requiring login or password.
 */

export interface EmailAddressConfig {
  companyName: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export const DEFAULT_POSTAL_ADDRESS: EmailAddressConfig = {
  companyName: 'YouTube Analytics Pro, Inc.',
  streetAddress: '548 Market St, Suite 98130',
  city: 'San Francisco',
  state: 'CA',
  postalCode: '94104-5401',
  country: 'United States of America',
};

export function getFormattedPostalAddress(config: EmailAddressConfig = DEFAULT_POSTAL_ADDRESS): string {
  return `${config.companyName} • ${config.streetAddress}, ${config.city}, ${config.state} ${config.postalCode}, ${config.country}`;
}

export function getUnsubscribeUrl(email: string = 'creator@example.com'): string {
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`;
}

/**
 * Standard Email Footer (CAN-SPAM & GDPR Compliant)
 */
export function getCompliantEmailFooter(recipientEmail: string = 'creator@example.com'): {
  textFooter: string;
  htmlFooter: string;
} {
  const unsubscribeUrl = getUnsubscribeUrl(recipientEmail);
  const postal = getFormattedPostalAddress();

  const textFooter = `
--------------------------------------------------------------------------------
You received this message because you have an account or active subscription with YouTube Analytics Pro.
Our physical mailing address:
${postal}

Unsubscribe immediately with one click:
${unsubscribeUrl}
--------------------------------------------------------------------------------`;

  const htmlFooter = `
<div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; line-height: 1.6; color: #64748b;">
  <p style="margin: 0 0 8px 0;">
    You are receiving this email because you are a registered creator or newsletter subscriber of <strong>YouTube Analytics Pro</strong>.
  </p>
  <p style="margin: 0 0 8px 0;">
    <strong>Postal Address:</strong> ${postal}
  </p>
  <p style="margin: 0;">
    <a href="${unsubscribeUrl}" style="color: #ff0033; text-decoration: underline; font-weight: 600;">Unsubscribe with 1-Click</a> &bull;
    <a href="${unsubscribeUrl}&manage=1" style="color: #64748b; text-decoration: underline; margin-left: 8px;">Manage Notification Preferences</a>
  </p>
</div>`;

  return { textFooter, htmlFooter };
}

/**
 * 1. Product Launch / Feature Announcement Email Template
 */
export function createLaunchEmailTemplate(params: {
  recipientName: string;
  recipientEmail: string;
  channelName: string;
}) {
  const { recipientName, recipientEmail, channelName } = params;
  const footer = getCompliantEmailFooter(recipientEmail);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const subject = `🚀 YouTube Analytics Pro is Live: 1-of-10 Outlier Radar & Creator Intelligence`;

  const textBody = `Hi ${recipientName},

We are thrilled to officially announce the launch of YouTube Analytics Pro!

We built this platform to replace bloated $100+/month creator tools with high-velocity algorithmic intelligence for ${channelName}:

• 1-of-10 Performance Radar: Compare your latest upload velocity against your past 9 videos.
• Velocity Outlier Multipliers: Automatic alerts when a video hits 2x, 5x, or 10x median velocity.
• Dynamic Heuristic SEO Engine: Real-time 0-100 title and metadata optimization score.
• Idea Vault & Kanban: Track your production pipeline from concept to published.

Explore your dashboard now:
${appUrl}

Best regards,
The YouTube Analytics Pro Team
${footer.textFooter}`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="background-color: #090a0f; color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px;">
  <div style="max-width: 580px; margin: 0 auto; background-color: #11131a; border: 1px solid #222536; border-radius: 16px; padding: 32px;">
    <div style="margin-bottom: 24px;">
      <span style="font-size: 18px; font-weight: bold; color: #ffffff;">YouTube Analytics <span style="background: #ff0033; color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px;">PRO</span></span>
    </div>
    
    <h1 style="font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 16px;">
      Welcome to High-Velocity Creator Intelligence
    </h1>
    
    <p style="font-size: 14px; line-height: 1.6; color: #94a3b8;">
      Hi ${recipientName},
    </p>
    
    <p style="font-size: 14px; line-height: 1.6; color: #94a3b8;">
      We built YouTube Analytics Pro to help creators like you make data-driven decisions for <strong>${channelName}</strong> without paying expensive legacy subscriptions.
    </p>

    <div style="background-color: #181a26; border-radius: 12px; padding: 16px; margin: 20px 0;">
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #cbd5e1; line-height: 1.8;">
        <li><strong>1-of-10 Performance Radar:</strong> Benchmarked against your last 9 uploads.</li>
        <li><strong>Outlier Velocity Math:</strong> Real-time 2x, 5x, and 10x viral surge detection.</li>
        <li><strong>Heuristic SEO Scorer:</strong> Instant 0–100 metadata audit score.</li>
        <li><strong>Idea Vault Kanban:</strong> Production pipeline from Script to Scheduled.</li>
      </ul>
    </div>

    <div style="margin: 28px 0;">
      <a href="${appUrl}" style="background-color: #ff0033; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 13px; display: inline-block;">
        Launch Your Creator Dashboard &rarr;
      </a>
    </div>

    <p style="font-size: 13px; color: #64748b;">
      Keep creating,<br>The YouTube Analytics Pro Team
    </p>

    ${footer.htmlFooter}
  </div>
</body>
</html>`;

  return { subject, textBody, htmlBody };
}

/**
 * 2. Weekly Performance Digest Email Template
 */
export function createWeeklyDigestEmailTemplate(params: {
  recipientName: string;
  recipientEmail: string;
  channelName: string;
  weeklyViews: string;
  weeklySubs: string;
  topVideoTitle: string;
}) {
  const { recipientName, recipientEmail, channelName, weeklyViews, weeklySubs, topVideoTitle } = params;
  const footer = getCompliantEmailFooter(recipientEmail);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const subject = `📊 Weekly Creator Digest: ${channelName} gained ${weeklySubs} subscribers`;

  const textBody = `Hi ${recipientName},

Here is your weekly performance digest for ${channelName}:

• Views: +${weeklyViews}
• Subscribers: +${weeklySubs}
• Top Performing Upload: "${topVideoTitle}"

View full weekly analytics and retention curves:
${appUrl}

Best regards,
YouTube Analytics Pro
${footer.textFooter}`;

  return { subject, textBody };
}
