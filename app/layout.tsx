import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Fraunces } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { getSiteSettings } from "@/lib/site-settings";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz", "SOFT"],
  display: "swap",
});
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    metadataBase: new URL(settings.siteUrl),
    title: {
      default: `${settings.ownerName} — ${settings.headline}`,
      template: `%s · ${settings.ownerName}`,
    },
    description: settings.siteDescription,
    openGraph: {
      title: `${settings.ownerName} — ${settings.headline}`,
      description: settings.siteDescription,
      type: "website",
      url: settings.siteUrl,
      siteName: settings.ownerName,
    },
    twitter: {
      card: "summary_large_image",
      title: `${settings.ownerName} — ${settings.headline}`,
    },
    alternates: { canonical: settings.siteUrl },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${display.variable} ${mono.variable}`}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
