import { EMAIL_BRAND_NAME } from "@/lib/email/html-layout";
import { sendTransactionalEmail } from "./mailer";
import {
  emailDocumentHtml,
  emailGreetingHtml,
  emailParagraphHtml,
  emailReasonBoxHtml,
} from "./html-layout";

export async function sendRegistrationApprovedEmail(
  to: string,
  displayName: string,
): Promise<void> {
  const subject = `Your account is approved — ${EMAIL_BRAND_NAME}`;
  const text = `Assalamu alaikum ${displayName},\n\nYour registration has been approved. You can now sign in to ${EMAIL_BRAND_NAME} and start submitting your daily report.\n\nIf you did not request this, you can ignore this message.\n`;

  const inner = [
    emailGreetingHtml(displayName),
    emailParagraphHtml(
      "Your registration has been approved. You can sign in with the email and password you chose at registration.",
    ),
    emailParagraphHtml("We are glad to have you with us."),
  ].join("");

  const html = emailDocumentHtml({
    title: "You're approved",
    preheader: `Your ${EMAIL_BRAND_NAME} account is ready to use.`,
    innerHtml: inner,
  });

  await sendTransactionalEmail({ to, subject, text, html });
}

export async function sendRegistrationRejectedEmail(
  to: string,
  displayName: string,
  reason: string,
): Promise<void> {
  const subject = `Update on your registration — ${EMAIL_BRAND_NAME}`;
  const text = `Assalamu alaikum ${displayName},\n\nWe were unable to approve your registration at this time.\n\nReason:\n${reason}\n\nIf you have questions, please contact your halqa Incharge or administrator.\n`;

  const inner = [
    emailGreetingHtml(displayName),
    emailParagraphHtml(
      "We were unable to approve your registration at this time. The reason below was provided by the reviewer:",
    ),
    emailReasonBoxHtml(reason),
    emailParagraphHtml(
      "If you believe this was a mistake, please reach out to your halqa Incharge or administrator.",
    ),
  ].join("");

  const html = emailDocumentHtml({
    title: "Registration update",
    preheader: `An update on your ${EMAIL_BRAND_NAME} registration request.`,
    innerHtml: inner,
  });

  await sendTransactionalEmail({ to, subject, text, html });
}
