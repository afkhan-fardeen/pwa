import Link from "next/link";
import { AuthPage } from "@/components/auth/auth-page";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { buttonVariants } from "@/components/ui/button-variants";
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const valid = typeof token === "string" && token.length >= 10;

  return (
    <AuthPage
      title="Set a new password"
      description="Choose a strong password. You’ll be redirected to sign in when done."
      footer={
        <Link
          href="/login"
          className={buttonVariants({ variant: "link", className: "text-primary font-semibold" })}
        >
          ← Back to sign in
        </Link>
      }
    >
      {valid ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div className="border-destructive/20 bg-destructive/5 text-destructive rounded-2xl border px-4 py-4 text-center text-sm leading-relaxed">
          This link is invalid or expired. Request a new reset from the forgot
          password page.
        </div>
      )}
    </AuthPage>
  );
}
