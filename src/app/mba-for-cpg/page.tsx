import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MBA for CPG - Dream Makers HQ",
  description:
    "Everything you'd learn in a $50K business school, built specifically for CPG founders. $997, lifetime access.",
};

export default function MbaForCpgPage() {
  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-accent text-white rounded-full mb-4">
          Coming Soon
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">MBA for CPG</h1>
        <p className="mt-4 text-lg text-muted">
          Full course details are on the way. In the meantime, head back to the homepage or get in
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
