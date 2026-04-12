import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "90-Day Breakthrough - Dream Makers HQ",
  description:
    "90 days of direct work with Jeff Church to break through whatever's between you and your next stage in CPG.",
};

export default function NinetyDayBreakthroughPage() {
  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-accent text-white rounded-full mb-4">
          Coming Soon
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          The 90-Day Breakthrough
        </h1>
        <p className="mt-4 text-lg text-muted">
          Full program details are on the way. In the meantime, head back to the homepage or get in
          touch.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 border border-border hover:border-foreground font-semibold rounded-lg transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
