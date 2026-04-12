import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
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
  title: "Dream Makers HQ - Break through to your next stage in CPG.",
  description:
    "Tools, training, and direct access to Jeff Church - 8x CPG founder - for founders going from idea to exit.",
  openGraph: {
    title: "Dream Makers HQ - Break through to your next stage in CPG.",
    description:
      "Tools, training, and direct access to Jeff Church - 8x CPG founder - for founders going from idea to exit.",
    type: "website",
    url: "https://dreammakershq.com",
    siteName: "Dream Makers HQ",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dream Makers HQ - Break through to your next stage in CPG.",
    description:
      "Tools, training, and direct access to Jeff Church - 8x CPG founder - for founders going from idea to exit.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
