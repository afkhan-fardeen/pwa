import { resetLinkBaseUrl } from "@/lib/auth/reset-token";
import { PASSWORD_RESET_EXPIRY_MINUTES } from "@/lib/constants/password-reset";
import {
  EMAIL_BRAND_NAME,
  emailDocumentHtml,
  emailGreetingHtml,
  emailParagraphHtml,
  emailPrimaryButtonHtml,
} from "@/lib/email/html-layout";
import { sendTransactionalEmail } from "@/lib/email/mailer";

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string,
): Promise<boolean> {
  const base = resetLinkBaseUrl();
  const url = `${base}/reset-password?token=${encodeURIComponent(token)}`;

  const inner = [
    emailGreetingHtml(name),
    emailParagraphHtml(
      `Use the button below to set a new password. This link expires in ${PASSWORD_RESET_EXPIRY_MINUTES} minutes.`,
    ),
    emailPrimaryButtonHtml(url, "Reset password"),
    emailParagraphHtml(
      "If you did not request a password reset, you can ignore this email.",
    ),
  ].join("");

  const html = emailDocumentHtml({
    title: "Reset your password",
    preheader: `Set a new password — link valid ${PASSWORD_RESET_EXPIRY_MINUTES} minutes.`,
    innerHtml: inner,
  });

  const text = `Assalamu alaikum ${name},\n\nReset your password (valid ${PASSWORD_RESET_EXPIRY_MINUTES} minutes):\n${url}\n\nIf you did not request this, ignore this email.\n`;

  return sendTransactionalEmail({
    to: email,
    subject: `Reset your ${EMAIL_BRAND_NAME} password`,
    text,
    html,
  });
}

export async function sendPasswordChangedConfirmationEmail(
  email: string,
  name: string,
): Promise<boolean> {
  const base = resetLinkBaseUrl();
  const loginUrl = `${base}/login`;

  const inner = [
    emailGreetingHtml(name),
    emailParagraphHtml(
      "Your password was successfully updated. You can sign in with your new password anytime.",
    ),
    emailPrimaryButtonHtml(loginUrl, "Sign in"),
    emailParagraphHtml(
      "If you did not change your password, contact your halqa team immediately.",
    ),
  ].join("");

  const html = emailDocumentHtml({
    title: "Password updated",
    preheader: "Your Qalbee password was changed.",
    innerHtml: inner,
  });

  const text = `Assalamu alaikum ${name},\n\nYour ${EMAIL_BRAND_NAME} password was changed successfully.\n\nSign in: ${loginUrl}\n\nIf you did not make this change, contact your halqa team immediately.\n`;

  return sendTransactionalEmail({
    to: email,
    subject: `Your ${EMAIL_BRAND_NAME} password was changed`,
    text,
    html,
  });
}
