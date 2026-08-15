import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";
import { ProgressProvider } from "@/lib/progress";
import { AppShell } from "@/components/AppShell";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexSerif = IBM_Plex_Serif({
  variable: "--font-plex-serif",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Math for a CS Degree",
  description:
    "Thirteen tracks in strict order: pre-algebra through calculus, discrete math through cryptography, ending at the mathematics a neural network actually runs on.",
  applicationName: "Math for a CS Degree",
  authors: [{ name: "Mujtaba Hashimi" }],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0c0e" },
    { media: "(prefers-color-scheme: light)", color: "#f6f5f2" },
  ],
};

/**
 * Resolves the theme before first paint so a stored light choice never flashes
 * dark. Runs ahead of hydration, hence the raw string.
 */
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("mfcs-theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";}document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body
        className={`${plexSans.variable} ${plexMono.variable} ${plexSerif.variable} antialiased`}
      >
        <ProgressProvider>
          <AppShell>{children}</AppShell>
        </ProgressProvider>
      </body>
    </html>
  );
}
