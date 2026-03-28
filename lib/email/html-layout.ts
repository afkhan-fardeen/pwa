export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Matches member app light theme (MUI primary #1565c0, background #f5f5f5). */
export const EMAIL_BRAND_NAME = "Qalbee";

/**
 * Responsive HTML email shell with inline-safe styles (works in major clients).
 */
export function emailDocumentHtml({
  title,
  preheader,
  innerHtml,
  footerText,
}: {
  title: string;
  preheader: string;
  innerHtml: string;
  footerText?: string;
}): string {
  const footer =
    footerText ??
    `You are receiving this because you have an account with ${EMAIL_BRAND_NAME}.`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>${escapeHtml(title)}</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    body { margin:0; padding:0; -webkit-text-size-adjust:100%; background:#f5f5f5; }
    table { border-collapse:collapse; }
    img { border:0; line-height:100%; outline:none; text-decoration:none; }
  </style>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Roboto,'Helvetica Neue',Arial,sans-serif;">
  <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">${escapeHtml(preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(21,101,192,0.1);border:1px solid #e0e0e0;">
          <tr>
            <td style="background:linear-gradient(135deg,#1565c0 0%,#1976d2 100%);padding:26px 28px 22px;text-align:center;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.85);">${escapeHtml(EMAIL_BRAND_NAME)}</p>
              <h1 style="margin:0;font-size:22px;font-weight:600;letter-spacing:-0.02em;line-height:1.25;color:#ffffff;">${escapeHtml(title)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 28px 8px;font-size:16px;line-height:1.65;color:#212121;">
              ${innerHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 28px;font-size:13px;line-height:1.5;color:#757575;border-top:1px solid #e0e0e0;">
              <p style="margin:16px 0 0;">${escapeHtml(footer)}</p>
            </td>
          </tr>
        </table>
        <p style="margin:20px 0 0;font-size:12px;color:#9e9e9e;max-width:560px;">${escapeHtml(EMAIL_BRAND_NAME)}</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function emailParagraphHtml(text: string): string {
  return `<p style="margin:0 0 16px;">${escapeHtml(text)}</p>`;
}

export function emailGreetingHtml(name: string): string {
  return emailParagraphHtml(`Assalamu alaikum ${name},`);
}

export function emailReasonBoxHtml(reason: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;background:#fafafa;border:1px solid #e0e0e0;border-radius:10px;">
    <tr><td style="padding:14px 16px;font-size:15px;line-height:1.55;color:#424242;">${escapeHtml(reason)}</td></tr>
  </table>`;
}

/** Primary CTA — matches MUI contained button (light app). */
export function emailPrimaryButtonHtml(href: string, label: string): string {
  const safeHref = href
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;");
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0 8px;">
  <tr>
    <td align="left">
      <a href="${safeHref}" style="display:inline-block;padding:14px 28px;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:10px;background:#1565c0;box-shadow:0 2px 8px rgba(21,101,192,0.35);">${escapeHtml(label)}</a>
    </td>
  </tr>
</table>`;
}
