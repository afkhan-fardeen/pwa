import Link from "next/link";
import { AuthPage } from "@/components/auth/auth-page";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { buttonVariants } from "@/components/ui/button-variants";
import { PASSWORD_RESET_EXPIRY_MINUTES } from "@/lib/constants/password-reset";

export default function ForgotPasswordPage() {
  return (
    <AuthPage
      title="Forgot password"
      description={`Enter your email. If an account exists, we will send a reset link that expires in ${PASSWORD_RESET_EXPIRY_MINUTES} minutes.`}
      footer={
        <Link
          href="/login"
          className={buttonVariants({ variant: "link", className: "text-primary font-semibold" })}
        >
          ← Back to sign in
        </Link>
      }
    >
      <ForgotPasswordForm />
    </AuthPage>
  );
}
