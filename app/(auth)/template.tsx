import type { ReactNode } from "react";

/** No enter animation — keeps auth screens (forgot password, login) feeling instant. */
export default function AuthTemplate({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
