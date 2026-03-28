import nodemailer from "nodemailer";

function getTransport() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    requireTLS: true,
    auth: { user, pass },
  });
}

export function isMailConfigured(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

/** Shown as sender name when `EMAIL_FROM` is unset (inbox: “Qalbee Support”). */
export const DEFAULT_TRANSACTIONAL_FROM_NAME = "Qalbee Support";

export function defaultFromAddress(): string {
  const explicit = process.env.EMAIL_FROM?.trim();
  if (explicit) return explicit;
  const user = process.env.SMTP_USER;
  if (user) return `${DEFAULT_TRANSACTIONAL_FROM_NAME} <${user}>`;
  return "";
}

export async function sendTransactionalEmail(options: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<boolean> {
  const transport = getTransport();
  const from = defaultFromAddress();

  if (!transport || !from) {
    console.warn("[email:skipped]", {
      to: options.to,
      subject: options.subject,
      reason: "SMTP not configured",
      hint: "Set SMTP_USER and SMTP_PASS in .env.local (see .env.example)",
    });
    return false;
  }

  await transport.sendMail({
    from,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
  return true;
}
