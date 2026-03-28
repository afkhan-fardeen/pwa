import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { AuthPage } from "@/components/auth/auth-page";
function safeCallbackUrl(raw: string | undefined): string {
  if (typeof raw !== "string" || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/";
  }
  return raw;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = safeCallbackUrl(params.callbackUrl);

  return (
    <AuthPage
      title="Sign in"
      description="Welcome back. Sign in with your Qalbee account email and password."
      footer={
        <div className="space-y-2 text-center text-sm text-gray-600">
          <p>
            No account?{" "}
            <Link href="/register" className="font-semibold text-[#1565c0] underline-offset-2 hover:underline">
              Create an account
            </Link>
          </p>
          <p>
            <Link href="/install" className="font-semibold text-[#1565c0] underline-offset-2 hover:underline">
              Install the app
            </Link>
          </p>
        </div>
      }
    >
      <LoginForm callbackUrl={callbackUrl} />
    </AuthPage>
  );
}
