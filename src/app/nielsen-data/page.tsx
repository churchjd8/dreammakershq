import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nielsen Data Program - CPG Founders Group",
  description:
    "Access Nielsen data for your CPG brand at a fraction of the cost. Limited to the first 10 brands.",
  robots: { index: false, follow: false },
};

const included = [
  "3 data pulls during April – October (beginning, end, and 1 custom pull)",
  "Initial deep dive with Category Management Expert, Angela Cheng",
  "User-friendly templates to transform raw data into actionable competitive intelligence",
  'Panel data on your category and brand (where available)',
];

const addOns = [
  { label: "Additional custom data pulls", price: "$500 each" },
  { label: "Hourly category assistance from Angela", price: "$150/hr" },
];

const retailers = [
  "Acme Fresh Market", "Ahold Delhaize", "Albertsons Companies", "Allegiance Retail Services",
  "Alliance Retail Group", "Americas Food Basket", "B & B Foods", "Bashas", "Big Y",
  "BJs", "Brookshire Brothers", "Brookshire", "Buehlers", "C&S Grand Union",
  "Cardinal Health", "Cashwise", "Chedraui USA Corp", "Coborns", "Cub", "CVS",
  "Dagostino and Gristedes", "DeMoulas", "Dierbergs", "Dollar Tree", "Duane Reade",
  "El Rancho Supermercado", "El Super", "Fairplay Foods", "Family Dollar", "Fareway",
  "Festival Foods", "Fiesta", "Food Lion", "Food Maxx", "Fresco y Mas", "Giant Eagle",
  "Giant Food", "Good Food Holdings", "HAC", "Hannaford", "Harps", "Harvey's", "Heinens",
  "Hy-Vee", "IGA Supermarket", "Indiana Grocery Group", "King Kullen", "KVAT Food City",
  "Lowes Food", "Lucky", "Lunds & Byerlys", "Martin's", "Meijer", "Mitchell Grocery",
  "Niemann Foods", "Northeast Grocery", "Piggly Wiggly Carolina", "Piggly Wiggly Midwest",
  "Price Chopper", "Publix", "Raleys", "Reasors", "Rite Aid", "Roche Brothers", "Rouses",
  "Save Mart", "Save-A-Lot", "Schnucks", "SEG", "Shoppers Food Warehouse", "ShopRite",
  "Smart & Final", "SpartanNash", "Stater Bros", "Stop & Shop", "Target",
  "The Fresh Market", "The Giant Company", "Tonys Finer Foods", "Tops", "UNFI",
  "Vallarta Supermarkets", "Walgreens", "Wegmans", "Weis", "Whole Foods", "Wine.Com",
  "Winn Dixie",
];

export default function NielsenDataPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-foreground text-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-accent text-white rounded-full mb-6">
              Limited to 10 Brands
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
              Nielsen Data Program
            </h1>
            <p className="mt-2 text-lg text-white/50">
              April &ndash; October 2026
            </p>
            <p className="mt-6 text-lg text-white/70 max-w-2xl leading-relaxed">
              Nielsen data is normally restricted to businesses with at least $20M in annual
              revenue, putting smaller brands at a significant disadvantage. Through a unique
              six-month program Jeff has negotiated with Nielsen, that&rsquo;s no longer the
              case&mdash;you can access the same data at a fraction of the cost.
            </p>
            <div className="mt-8">
              <a
                href="https://buy.stripe.com/3cI14ndnyeHY8kyfexbbG0c"
                className="inline-flex items-center justify-center px-8 py-4 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-colors text-lg"
              >
                Reserve your spot &mdash; $1,500 &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Value prop */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Enterprise-level data, startup-friendly pricing
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              A single data pull from Nielsen typically costs $10K or more. For $1,500, you get
              multiple pulls and expert Category Management over the full six-month
              period&mdash;comprehensive data across your specific category or categories including
              brand and competitor sales by product, retailer sales, velocity data, and much more.
            </p>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-16 md:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-10">
            What&rsquo;s included
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {included.map((item) => (
              <div
                key={item}
                className="flex items-start gap-4 p-6 bg-white rounded-xl border border-border"
              >
                <div className="flex-shrink-0 mt-1 h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center">
                  <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-foreground font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data pull timeline */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-10">
            Data pull timeline
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { when: "April 2026", label: "Baseline pull", desc: "Kick off with a full category snapshot" },
              { when: "By September 2026", label: "Custom pull", desc: "A tailored pull based on your specific needs" },
              { when: "October 2026", label: "Final pull", desc: "Perfect timing for fall sell-in buyer meetings" },
            ].map((step) => (
              <div key={step.when} className="p-6 bg-background rounded-xl border border-border">
                <span className="inline-block px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent mb-3">
                  {step.when}
                </span>
                <h3 className="text-lg font-bold">{step.label}</h3>
                <p className="mt-2 text-sm text-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-16 md:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
            Available add-ons
          </h2>
          <div className="grid gap-4 md:grid-cols-2 max-w-2xl">
            {addOns.map((item) => (
              <div key={item.label} className="flex items-center justify-between p-5 bg-white rounded-xl border border-border">
                <span className="font-medium">{item.label}</span>
                <span className="text-accent font-bold">{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Retailer coverage */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Retailer coverage
          </h2>
          <p className="mt-4 text-muted max-w-2xl">
            Access data across {retailers.length}+ retailers spanning grocery, mass, drug, club, and natural channels.
            If your category isn&rsquo;t listed, Jeff will work with Nielsen to place you correctly.
          </p>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {retailers.map((name) => (
              <div
                key={name}
                className="px-4 py-3 bg-background rounded-lg border border-border text-sm font-medium text-foreground text-center"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 md:py-24 bg-foreground text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Spots are limited to 10 brands
          </h2>
          <p className="mt-4 text-lg text-white/70">
            This is exceptional value for real-time visibility into the competitive landscape,
            your retail performance, and how your brand stacks up.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://buy.stripe.com/3cI14ndnyeHY8kyfexbbG0c"
              className="inline-flex items-center justify-center px-8 py-4 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-colors text-lg"
            >
              Reserve your spot &mdash; $1,500 &rarr;
            </a>
            <a
              href="mailto:info@cpgfoundersgroup.com"
              className="inline-flex items-center justify-center px-8 py-4 border border-white/30 hover:border-white/60 text-white font-semibold rounded-lg transition-colors text-lg"
            >
              Questions? Email us
            </a>
          </div>
          <p className="mt-6 text-sm text-white/40">
            Program runs April &ndash; October 2026.
          </p>
        </div>
      </section>
    </>
  );
}
