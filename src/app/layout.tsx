import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CPG Founders Group - The operator's playbook for CPG founders.",
  description:
    "Strategic direction, operating infrastructure, and AI-powered tools from Jeff Church - 8x CPG founder - to help you scale, raise, and exit.",
  openGraph: {
    title: "CPG Founders Group - The operator's playbook for CPG founders.",
    description:
      "Strategic direction, operating infrastructure, and AI-powered tools from Jeff Church - 8x CPG founder - to help you scale, raise, and exit.",
    type: "website",
    url: "https://cpgfoundersgroup.com",
    siteName: "CPG Founders Group",
  },
  twitter: {
    card: "summary_large_image",
    title: "CPG Founders Group - The operator's playbook for CPG founders.",
    description:
      "Strategic direction, operating infrastructure, and AI-powered tools from Jeff Church - 8x CPG founder - to help you scale, raise, and exit.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cfBeaconToken = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;

  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {cfBeaconToken ? (
          <Script
            id="cf-web-analytics"
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: cfBeaconToken })}
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
