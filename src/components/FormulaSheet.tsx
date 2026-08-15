"use client";

import { useRouter } from "next/navigation";
import { GhostButton, PrimaryButton } from "@/components/ui";

/** The sheet's only interactive parts — the rest of the page stays a Server Component. */
export function PrintButton() {
  return <PrimaryButton onClick={() => window.print()}>Print</PrimaryButton>;
}

export function BackButton() {
  const router = useRouter();
  return <GhostButton onClick={() => router.push("/")}>Back</GhostButton>;
}
