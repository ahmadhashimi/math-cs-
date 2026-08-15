import type { Metadata } from "next";
import { CertificateView } from "@/components/exam/CertificateView";
import { TRACKS } from "@/lib/course";

export const metadata: Metadata = {
  title: "Certificate of completion · Math for a CS Degree",
};

export default function CertificatePage() {
  return (
    <CertificateView
      tracks={TRACKS.map((track) => ({ id: track.id, n: track.n }))}
    />
  );
}
