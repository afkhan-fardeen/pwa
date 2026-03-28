import type { Metadata } from "next";
import { InstallAppClient } from "@/components/pwa/install-app-client";

export const metadata: Metadata = {
  title: "Install",
  description: "Add Qalbee to your home screen for quick access and notifications.",
};

export default function InstallPage() {
  return (
    <div className="from-background min-h-screen bg-gradient-to-b to-indigo-50/40 dark:to-indigo-950/30">
      <InstallAppClient />
    </div>
  );
}
