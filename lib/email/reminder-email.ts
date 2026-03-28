import { resetLinkBaseUrl } from "@/lib/auth/reset-token";
import { isMailConfigured, sendTransactionalEmail } from "@/lib/email/mailer";
import {
  emailDocumentHtml,
  emailGreetingHtml,
  emailParagraphHtml,
} from "@/lib/email/html-layout";

function linkParagraphHtml(href: string, label: string): string {
  const safeHref = href.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
  return `<p style="margin:0 0 16px;">You can <a href="${safeHref}" style="color:#1565c0;font-weight:600;">${label}</a>.</p>`;
}

/**
 * Optional daily nudge when SMTP is configured (cron job).
 */
export async function sendDailyReportReminderEmail(
  to: string,
  displayName: string,
): Promise<boolean> {
  if (!isMailConfigured()) {
    return false;
  }

  const base = resetLinkBaseUrl().replace(/\/$/, "");
  const openUrl = `${base}/submit`;

  const subject = "Reminder — complete today’s daily log";

  const text = `Assalamu alaikum ${displayName},\n\nThis is a friendly reminder to save Salah, Quran, and Hadith for today’s daily log when you can.\n\nOpen the app: ${openUrl}\n\nIf you already saved all three sections today, you can ignore this message.\n`;

  const inner = [
    emailGreetingHtml(displayName),
    emailParagraphHtml(
      "This is a friendly reminder to complete today’s daily log: save your Salah, Quran, and Hadith sections when you can.",
    ),
    linkParagraphHtml(openUrl, "open the submission form"),
    emailParagraphHtml(
      "If you already saved all three sections today, you can ignore this message.",
    ),
  ].join("");

  const html = emailDocumentHtml({
    title: "Daily log reminder",
    preheader: "Save Salah, Quran, and Hadith for today when you’re ready.",
    innerHtml: inner,
  });

  const sent = await sendTransactionalEmail({ to, subject, text, html });
  return sent;
}
