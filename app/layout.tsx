import type { Metadata, Viewport } from "next";
import { Geist_Mono, Roboto } from "next/font/google";
import { RegisterServiceWorker } from "@/components/pwa/register-service-worker";
import { SwUpdatePrompt } from "@/components/pwa/sw-update-prompt";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { MuiAppProvider } from "@/components/providers/mui-app-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

const fontMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1565c0" },
    { media: "(prefers-color-scheme: dark)", color: "#0d47a1" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Qalbee",
    template: "%s · Qalbee",
  },
  description:
    "Qalbee — daily worship, outreach, and contributions for your community.",
  applicationName: "Qalbee",
  appleWebApp: {
    capable: true,
    title: "Qalbee",
    statusBarStyle: "default",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className={`${roboto.variable} ${fontMono.variable} h-full`}>
      <body className={`${roboto.className} bg-[#f5f5f5] text-gray-900 min-h-full flex flex-col`}>
        <MuiAppProvider>
          <RegisterServiceWorker />
          <SwUpdatePrompt />
          <AuthSessionProvider>
            {children}
            <Toaster />
          </AuthSessionProvider>
        </MuiAppProvider>
      </body>
    </html>
  );
}
