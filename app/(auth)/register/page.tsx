import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { AuthPage } from "@/components/auth/auth-page";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
export default function RegisterPage() {
  return (
    <AuthPage
      title="Create an account"
      description="Request access to your halqa. An Incharge or administrator will review your details before you can sign in."
      footer={
        <p>
          Already have an account?{" "}
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "link" }),
              "text-primary h-auto p-0 font-semibold underline-offset-4 hover:underline",
            )}
          >
            Sign in
          </Link>
        </p>
      }
    >
      <RegisterForm />
    </AuthPage>
  );
}
