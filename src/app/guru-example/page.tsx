import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sample Guru Report: Competitive Pricing & Attributes - CPG Founders Group",
  description:
    "An example output from Babu's Competitive Pricing & Attributes Guru. Refrigerated Cold Pressed Juice Competitive Pricing Analysis, US Market, April 2026.",
};

const pricingLadder = [
  { tier: "Value", brand: "Simply", type: "Legacy", price: "$4.79", size: "46 oz", perOz: 0.10, segment: "Premium NFC Juice" },
  { tier: "Accessible Organic", brand: "Santa Cruz Organic", type: "Challenger", price: "$5.49", size: "32 oz", perOz: 0.17, segment: "Organic Juice & Lemonade" },
  { tier: "Accessible Organic", brand: "R.W. Knudsen", type: "Challenger", price: "$5.49", size: "32 oz", perOz: 0.17, segment: "Premium Organic Juice" },
  { tier: "Mainstream Smoothie", brand: "Bolthouse Farms", type: "Legacy", price: "$3.49", size: "15.2 oz", perOz: 0.23, segment: "Premium Smoothie & Juice" },
  { tier: "Mainstream Smoothie", brand: "Lakewood Organic", type: "Challenger", price: "$7.49", size: "32 oz", perOz: 0.23, segment: "Premium Organic Pressed Juice" },
  { tier: "Premium Smoothie", brand: "Naked Juice", type: "Legacy", price: "$3.79", size: "15.2 oz", perOz: 0.25, segment: "Premium Smoothie" },
  { tier: "Cold Pressed Premium", brand: "Suja Organic", type: "Legacy", price: "$3.99", size: "12 oz", perOz: 0.33, segment: "Premium Organic Cold Pressed" },
  { tier: "Cold Pressed Premium", brand: "Evolution Fresh", type: "Legacy", price: "$3.99", size: "11 oz", perOz: 0.36, segment: "Premium Cold Pressed" },
];

const crossRetailer = [
  { brand: "Suja Organic", amazon: "$21.31 (46oz)", kroger: "$3.99", ralphs: "$3.99", target: "$3.69", krogerOz: "$0.33", ralphsOz: "$0.33", targetOz: "$0.31" },
  { brand: "Evolution Fresh", amazon: "$45.01 (6-pk)", kroger: "$3.99", ralphs: "$3.99", target: "$3.99", krogerOz: "$0.36", ralphsOz: "$0.36", targetOz: "$0.36" },
  { brand: "Naked Juice", amazon: "$2.50", kroger: "$3.79", ralphs: "$3.79", target: "$3.19", krogerOz: "$0.25", ralphsOz: "$0.25", targetOz: "$0.21" },
  { brand: "Bolthouse Farms", amazon: "$61.99 (5-pk)", kroger: "$3.49", ralphs: "$3.99", target: "$7.99 (52oz)", krogerOz: "$0.23", ralphsOz: "$0.26", targetOz: "$0.15" },
  { brand: "Simply", amazon: "$4.63", kroger: "$4.79", ralphs: "$5.29", target: "$4.99", krogerOz: "$0.10", ralphsOz: "$0.12", targetOz: "$0.11" },
  { brand: "Lakewood Organic", amazon: "$8.49", kroger: "$7.49", ralphs: "$9.99", target: "$13.50", krogerOz: "$0.23", ralphsOz: "$0.31", targetOz: "$0.42" },
  { brand: "R.W. Knudsen", amazon: "$8.96", kroger: "$5.49", ralphs: "$6.99", target: "$10.50", krogerOz: "$0.17", ralphsOz: "$0.22", targetOz: "$0.33" },
  { brand: "Santa Cruz Organic", amazon: "$5.79", kroger: "$5.49", ralphs: "$5.49", target: "$4.29 (16oz)", krogerOz: "$0.17", ralphsOz: "$0.17", targetOz: "$0.27" },
];

const amazonPerf = [
  { brand: "Suja Organic", asin: "B09SDVMSLH", price: "$21.31", perOz: "$0.46", bsr: "194,613", avg30: "$30.58", rating: "4.8", reviews: "31", monthly: "—", trend: "Stable" },
  { brand: "Evolution Fresh", asin: "B00OX70JKW", price: "$45.01", perOz: "$0.49", bsr: "153,894", avg30: "$67.80", rating: "5.0", reviews: "2", monthly: "—", trend: "Stable" },
  { brand: "Naked Juice", asin: "B000WLZHNM", price: "$2.50", perOz: "$0.16", bsr: "6,131", avg30: "$3.06", rating: "4.7", reviews: "3,855", monthly: "$10,000", trend: "Stable" },
  { brand: "Bolthouse Farms", asin: "B0DPNLVJ1Q", price: "$61.99", perOz: "$0.24", bsr: "75,276", avg30: "$61.49", rating: "4.0", reviews: "4", monthly: "$2,950", trend: "Stable" },
  { brand: "Simply", asin: "B0DSWT3XBN", price: "$4.63", perOz: "$0.10", bsr: "1,185", avg30: "$4.20", rating: "4.8", reviews: "1,758", monthly: "$138,900", trend: "Stable" },
  { brand: "Lakewood Organic", asin: "B08R51GZWR", price: "$8.49", perOz: "$0.27", bsr: "2,545", avg30: "$9.14", rating: "4.6", reviews: "838", monthly: "$66,748", trend: "Stable" },
  { brand: "R.W. Knudsen", asin: "B0DG37MWQ8", price: "$8.96", perOz: "$0.28", bsr: "1,149", avg30: "$8.12", rating: "4.5", reviews: "628", monthly: "$144,184", trend: "Stable" },
  { brand: "Santa Cruz Organic", asin: "B000RELFP8", price: "$5.79", perOz: "$0.18", bsr: "38,654", avg30: "$4.83", rating: "4.6", reviews: "708", monthly: "$5,790", trend: "Stable" },
];

const whiteSpace = [
  { opportunity: "TikTok Commerce", gap: "0 of 8 brands on TikTok Shop", exposed: "All 8 brands", action: "First-mover TikTok Shop launch", evidence: "100% non-participation confirmed" },
  { opportunity: "$0.27–$0.32/oz Price Tier", gap: "No brand occupies this $/oz band at Kroger", exposed: "Suja, Evolution Fresh, Lakewood", action: "New SKU or size format to fill the gap", evidence: "Kroger ladder jumps from $0.25 to $0.33/oz" },
  { opportunity: "Large Format Cold Pressed", gap: "No cold pressed brand in 32oz+ at Kroger", exposed: "Suja, Evolution Fresh", action: "32oz cold pressed SKU at ~$10–11", evidence: "Lakewood/R.W. Knudsen own the 32oz organic tier" },
  { opportunity: "Amazon Cold Pressed", gap: "Suja BSR 194K, Evolution Fresh BSR 153K", exposed: "Suja, Evolution Fresh", action: "Optimize Amazon listings, reduce price gap vs Keepa average", evidence: "Keepa avg $30.58 vs current $21.31 for Suja" },
  { opportunity: "Ralphs Premium Shelf", gap: "Ralphs prices 15–25% above Kroger", exposed: "Lakewood, R.W. Knudsen", action: "Dedicated Ralphs promotional pricing", evidence: "Lakewood: $7.49 Kroger vs $9.99 Ralphs" },
  { opportunity: "Organic Mid-Tier Smoothie", gap: "No organic cold pressed smoothie at $0.20–$0.25/oz", exposed: "Suja, Bolthouse Farms", action: "Organic cold pressed smoothie blend at $3.49–$3.79/15oz", evidence: "Naked at $0.25/oz is non-organic; gap exists above it" },
  { opportunity: "Target Optimization", gap: "Lakewood Target price $13.50 vs $7.49 Kroger (+80%)", exposed: "Lakewood Organic", action: "Align Target pricing to within a 15–20% premium of Kroger", evidence: "$6.01 spread is the highest in the dataset" },
];

const brandProfiles = [
  { brand: "Suja Organic", type: "Legacy", founded: "2012", hq: "San Diego, CA", segment: "Premium Organic Cold Pressed", owner: "Independent (formerly private equity)", usp: "USDA Organic HPP cold pressed with live probiotics", distribution: "National retail, natural foods, DTC", bsr: "194,613", perOz: "$0.33" },
  { brand: "Evolution Fresh", type: "Legacy", founded: "2011", hq: "Rancho Cucamonga, CA", segment: "Premium Cold Pressed", owner: "Bolthouse Farms (acq. 2022)", usp: "Starbucks-backed HPP cold pressed, immunity-focused citrus blends", distribution: "Starbucks (10K+ locations), grocery (11K+ stores)", bsr: "153,894", perOz: "$0.36" },
  { brand: "Naked Juice", type: "Legacy", founded: "1983", hq: "Monrovia, CA", segment: "Premium Smoothie", owner: "PepsiCo", usp: "No-sugar-added fruit & vegetable smoothies, mass distribution", distribution: "National grocery, mass, convenience, food service", bsr: "6,131", perOz: "$0.25" },
  { brand: "Bolthouse Farms", type: "Legacy", founded: "1915", hq: "Bakersfield, CA", segment: "Premium Smoothie & Juice", owner: "Private equity (post-Campbell's)", usp: "Vertically integrated farm-to-bottle, 100+ year heritage", distribution: "National grocery, mass, natural foods", bsr: "75,276", perOz: "$0.23" },
  { brand: "Simply", type: "Legacy", founded: "2001", hq: "Atlanta, GA", segment: "Premium NFC Juice", owner: "Coca-Cola", usp: "Not-from-concentrate, no additives, transparent sourcing", distribution: "National grocery, mass, convenience", bsr: "1,185", perOz: "$0.10" },
  { brand: "Lakewood Organic", type: "Challenger", founded: "1935", hq: "Miami, FL", segment: "Premium Organic Pressed Juice", owner: "Family-owned", usp: "100% USDA Organic single-ingredient juices in glass bottles", distribution: "Natural foods, Whole Foods, independent grocers, online", bsr: "2,545", perOz: "$0.23" },
  { brand: "R.W. Knudsen", type: "Challenger", founded: "1961", hq: "Chico, CA", segment: "Premium Organic Juice", owner: "J.M. Smucker", usp: "Organic NFC functional blends (elderberry, beet, tart cherry)", distribution: "National grocery, natural foods, Whole Foods", bsr: "1,149", perOz: "$0.17" },
  { brand: "Santa Cruz Organic", type: "Challenger", founded: "1972", hq: "Chico, CA", segment: "Organic Juice & Lemonade", owner: "J.M. Smucker", usp: "Affordable USDA Organic juices and lemonades, California heritage", distribution: "National grocery, natural foods, Whole Foods", bsr: "38,654", perOz: "$0.17" },
];

const maxPerOz = Math.max(...pricingLadder.map((r) => r.perOz));

function TierBadge({ type }: { type: string }) {
  const isLegacy = type === "Legacy";
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${
        isLegacy ? "bg-foreground/10 text-foreground" : "bg-accent/15 text-accent-dark"
      }`}
    >
      {type}
    </span>
  );
}

export default function GuruExamplePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-foreground text-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <div className="max-w-4xl">
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-accent text-white rounded-full mb-6">
              Sample Guru Report
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
              Refrigerated Cold Pressed Juice Competitive Pricing Analysis
            </h1>
            <p className="mt-3 text-lg text-white/60">
              US Market &middot; April 2026
            </p>
            <p className="mt-6 text-lg text-white/70 max-w-3xl leading-relaxed">
              This is an example output from Babu&rsquo;s{" "}
              <span className="font-semibold text-white">Competitive Pricing &amp; Attributes Guru</span>{" "}
              &mdash; one of the specialized AI advisors inside Babu. It analyzes a category across
              pricing ladders, retail channels, Amazon performance, social presence, and white space
              &mdash; and ends with strategic recommendations a founder can act on.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/babu-early"
                className="inline-flex items-center justify-center px-8 py-4 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-colors"
              >
                Get early access to Babu &rarr;
              </Link>
              <a
                href="#report"
                className="inline-flex items-center justify-center px-8 py-4 border border-white/30 hover:border-white/60 text-white font-semibold rounded-lg transition-colors"
              >
                Jump to the report
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <section className="py-12 md:py-16 bg-white border-b border-border" id="report">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Brands analyzed", value: "8" },
              { label: "Retail channels", value: "4" },
              { label: "Category $/oz range", value: "$0.10 – $0.36" },
              { label: "Premium markup", value: "3.6×" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-accent">{s.value}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted font-semibold">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Pricing Ladder */}
      <section className="py-16 md:py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-sm font-bold uppercase tracking-wider text-accent">01</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Pricing Ladder</h2>
          </div>
          <p className="text-muted max-w-3xl mb-10">
            Kroger refrigerated juice pricing, cheapest to most expensive on a per-ounce basis. The
            ladder reveals a three-tier structure: a value floor, an organic mid-tier, and a cold
            pressed premium ceiling.
          </p>

          {/* Bar chart */}
          <div className="bg-white rounded-xl border border-border p-6 sm:p-8 mb-8">
            <div className="space-y-4">
              {pricingLadder.map((row) => (
                <div key={row.brand} className="grid grid-cols-12 items-center gap-3">
                  <div className="col-span-5 sm:col-span-3 text-sm font-semibold text-foreground">
                    {row.brand}
                  </div>
                  <div className="col-span-5 sm:col-span-7">
                    <div className="h-6 bg-background rounded-md overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-md"
                        style={{ width: `${(row.perOz / maxPerOz) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="col-span-2 text-right text-sm font-mono font-semibold">
                    ${row.perOz.toFixed(2)}/oz
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Full table */}
          <div className="bg-white rounded-xl border border-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-background">
                <tr className="text-left">
                  <th className="px-4 py-3 font-semibold">Tier</th>
                  <th className="px-4 py-3 font-semibold">Brand</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold text-right">Price</th>
                  <th className="px-4 py-3 font-semibold text-right">Size</th>
                  <th className="px-4 py-3 font-semibold text-right">$/oz</th>
                  <th className="px-4 py-3 font-semibold">Segment</th>
                </tr>
              </thead>
              <tbody>
                {pricingLadder.map((row) => (
                  <tr key={row.brand} className="border-t border-border">
                    <td className="px-4 py-3 text-muted">{row.tier}</td>
                    <td className="px-4 py-3 font-semibold">{row.brand}</td>
                    <td className="px-4 py-3"><TierBadge type={row.type} /></td>
                    <td className="px-4 py-3 text-right font-mono">{row.price}</td>
                    <td className="px-4 py-3 text-right font-mono">{row.size}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold">${row.perOz.toFixed(2)}</td>
                    <td className="px-4 py-3 text-muted">{row.segment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Key insights */}
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="bg-card-flagship border-l-4 border-accent rounded-r-xl p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-accent mb-2">Insight</p>
              <p className="text-sm leading-relaxed">
                Evolution Fresh and Suja Organic command the highest per-ounce prices at Kroger
                ($0.36 and $0.33/oz), reflecting their cold pressed HPP premium &mdash; a 3.3&times;
                markup over Simply&rsquo;s $0.10/oz baseline.
              </p>
            </div>
            <div className="bg-card-flagship border-l-4 border-accent rounded-r-xl p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-accent mb-2">Insight</p>
              <p className="text-sm leading-relaxed">
                Santa Cruz Organic and R.W. Knudsen share identical Kroger pricing at $5.49 /
                $0.17/oz in 32oz formats, creating direct head-to-head competition between two
                Smucker&rsquo;s-owned sibling brands.
              </p>
            </div>
            <div className="bg-card-flagship border-l-4 border-accent rounded-r-xl p-5 md:col-span-2">
              <p className="text-xs font-bold uppercase tracking-wider text-accent mb-2">Insight</p>
              <p className="text-sm leading-relaxed">
                The ladder reveals a clear three-tier structure: a value floor anchored by Simply
                ($0.10/oz), an organic mid-tier clustered around $0.17&ndash;$0.25/oz, and a cold
                pressed premium ceiling at $0.33&ndash;$0.36/oz &mdash; a 260% premium over the
                category floor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Cross-Retailer Matrix */}
      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-sm font-bold uppercase tracking-wider text-accent">02</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Cross-Retailer Price Matrix</h2>
          </div>
          <p className="text-muted max-w-3xl mb-8">
            Unit price by brand and channel across Amazon, Kroger, Ralphs, and Target.
          </p>

          <div className="bg-white rounded-xl border border-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-background">
                <tr className="text-left">
                  <th className="px-4 py-3 font-semibold">Brand</th>
                  <th className="px-4 py-3 font-semibold text-right">Amazon</th>
                  <th className="px-4 py-3 font-semibold text-right">Kroger</th>
                  <th className="px-4 py-3 font-semibold text-right">Ralphs</th>
                  <th className="px-4 py-3 font-semibold text-right">Target</th>
                  <th className="px-4 py-3 font-semibold text-right">Kroger $/oz</th>
                  <th className="px-4 py-3 font-semibold text-right">Ralphs $/oz</th>
                  <th className="px-4 py-3 font-semibold text-right">Target $/oz</th>
                </tr>
              </thead>
              <tbody>
                {crossRetailer.map((row) => (
                  <tr key={row.brand} className="border-t border-border">
                    <td className="px-4 py-3 font-semibold">{row.brand}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs">{row.amazon}</td>
                    <td className="px-4 py-3 text-right font-mono">{row.kroger}</td>
                    <td className="px-4 py-3 text-right font-mono">{row.ralphs}</td>
                    <td className="px-4 py-3 text-right font-mono">{row.target}</td>
                    <td className="px-4 py-3 text-right font-mono text-muted">{row.krogerOz}</td>
                    <td className="px-4 py-3 text-right font-mono text-muted">{row.ralphsOz}</td>
                    <td className="px-4 py-3 text-right font-mono text-muted">{row.targetOz}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="bg-background border border-border rounded-xl p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-accent mb-2">Volatility</p>
              <p className="text-sm leading-relaxed">
                Lakewood Organic shows the most extreme cross-retailer price volatility &mdash; a
                $6.01 spread between Kroger ($7.49) and Target ($13.50) for the same 32oz format.
              </p>
            </div>
            <div className="bg-background border border-border rounded-xl p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-accent mb-2">Discipline</p>
              <p className="text-sm leading-relaxed">
                Evolution Fresh maintains perfect price parity at $3.99 across Kroger, Ralphs, and
                Target &mdash; disciplined retail pricing likely enforced through its Bolthouse
                Farms / Starbucks distribution.
              </p>
            </div>
            <div className="bg-background border border-border rounded-xl p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-accent mb-2">Regional</p>
              <p className="text-sm leading-relaxed">
                Ralphs consistently prices higher than Kroger for the same SKUs (Bolthouse +$0.50,
                R.W. Knudsen +$1.50, Lakewood +$2.50) &mdash; a regional premium positioning in
                Southern California.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Amazon Performance */}
      <section className="py-16 md:py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-sm font-bold uppercase tracking-wider text-accent">03</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Amazon Marketplace Performance</h2>
          </div>
          <p className="text-muted max-w-3xl mb-8">
            ASIN-level performance with current price, 30-day Keepa average, BSR, rating, and
            estimated monthly revenue.
          </p>

          <div className="bg-white rounded-xl border border-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-background">
                <tr className="text-left">
                  <th className="px-4 py-3 font-semibold">Brand</th>
                  <th className="px-4 py-3 font-semibold">ASIN</th>
                  <th className="px-4 py-3 font-semibold text-right">Price</th>
                  <th className="px-4 py-3 font-semibold text-right">$/oz</th>
                  <th className="px-4 py-3 font-semibold text-right">BSR</th>
                  <th className="px-4 py-3 font-semibold text-right">30-Day Avg</th>
                  <th className="px-4 py-3 font-semibold text-right">Rating</th>
                  <th className="px-4 py-3 font-semibold text-right">Reviews</th>
                  <th className="px-4 py-3 font-semibold text-right">Est. Monthly Rev.</th>
                </tr>
              </thead>
              <tbody>
                {amazonPerf.map((row) => (
                  <tr key={row.brand} className="border-t border-border">
                    <td className="px-4 py-3 font-semibold">{row.brand}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted">{row.asin}</td>
                    <td className="px-4 py-3 text-right font-mono">{row.price}</td>
                    <td className="px-4 py-3 text-right font-mono text-muted">{row.perOz}</td>
                    <td className="px-4 py-3 text-right font-mono">{row.bsr}</td>
                    <td className="px-4 py-3 text-right font-mono text-muted">{row.avg30}</td>
                    <td className="px-4 py-3 text-right font-mono">{row.rating}</td>
                    <td className="px-4 py-3 text-right font-mono">{row.reviews}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold">{row.monthly}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="bg-card-flagship border-l-4 border-accent rounded-r-xl p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-accent mb-2">Challenger Leader</p>
              <p className="text-sm leading-relaxed">
                R.W. Knudsen leads Amazon estimated annual revenue at $1.73M with a best-in-class
                BSR of #1,149 &mdash; outperforming Suja (#194,613) and Evolution Fresh (#153,894)
                by 100&times;+ in search rank.
              </p>
            </div>
            <div className="bg-card-flagship border-l-4 border-accent rounded-r-xl p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-accent mb-2">Legacy Leader</p>
              <p className="text-sm leading-relaxed">
                Simply achieves the highest estimated monthly revenue among legacy brands at
                $138,900 with a single SKU &mdash; volume velocity at a low price point outperforms
                premium positioning on Amazon.
              </p>
            </div>
            <div className="bg-card-flagship border-l-4 border-accent rounded-r-xl p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-accent mb-2">Red Flag</p>
              <p className="text-sm leading-relaxed">
                Suja and Evolution Fresh current prices ($21.31 and $45.01) sit dramatically above
                their 30-day Keepa averages ($30.58, $67.80) &mdash; likely third-party or
                out-of-stock scenarios, not brand-direct sales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Social / TikTok */}
      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-sm font-bold uppercase tracking-wider text-accent">04</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Social Media &amp; Digital Presence</h2>
          </div>
          <p className="text-muted max-w-3xl mb-8">
            Where the entire category is asleep at the wheel.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-foreground text-white rounded-xl p-8">
              <div className="text-6xl font-bold text-accent">0/8</div>
              <p className="mt-3 text-lg font-semibold">brands on TikTok Shop</p>
              <p className="mt-3 text-white/70 text-sm leading-relaxed">
                Zero of eight brands are confirmed active on TikTok Shop &mdash; a unanimous blind
                spot across both legacy and challenger brands in a channel where beverage and
                wellness products have demonstrated explosive organic growth.
              </p>
            </div>
            <div className="bg-foreground text-white rounded-xl p-8">
              <div className="text-6xl font-bold text-accent">$4.6M+</div>
              <p className="mt-3 text-lg font-semibold">combined Amazon revenue, uncontested on TikTok</p>
              <p className="mt-3 text-white/70 text-sm leading-relaxed">
                A significant first-mover opportunity: whichever brand activates TikTok Shop first
                in the refrigerated cold pressed juice category stands to capture an uncontested
                digital audience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: White Space */}
      <section className="py-16 md:py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-sm font-bold uppercase tracking-wider text-accent">05</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">White Space &amp; Opportunities</h2>
          </div>
          <p className="text-muted max-w-3xl mb-8">
            Seven category gaps the Guru identified, with the brands most exposed and the evidence
            behind each call.
          </p>

          <div className="space-y-4">
            {whiteSpace.map((row) => (
              <div key={row.opportunity} className="bg-white rounded-xl border border-border p-6">
                <div className="grid md:grid-cols-12 gap-4">
                  <div className="md:col-span-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-accent mb-1">Opportunity</p>
                    <p className="font-semibold">{row.opportunity}</p>
                  </div>
                  <div className="md:col-span-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Gap</p>
                    <p className="text-sm">{row.gap}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Exposed</p>
                    <p className="text-sm">{row.exposed}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Action</p>
                    <p className="text-sm">{row.action}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Evidence</p>
                    <p className="text-sm text-muted">{row.evidence}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Brand Profiles */}
      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-sm font-bold uppercase tracking-wider text-accent">06</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Brand Profiles</h2>
          </div>
          <p className="text-muted max-w-3xl mb-8">
            The eight brands in the competitive set &mdash; ownership, USP, distribution, Amazon
            rank, and Kroger $/oz.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {brandProfiles.map((b) => (
              <div key={b.brand} className="bg-background rounded-xl border border-border p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-lg font-bold">{b.brand}</h3>
                    <p className="text-xs text-muted mt-0.5">
                      Founded {b.founded} &middot; {b.hq}
                    </p>
                  </div>
                  <TierBadge type={b.type} />
                </div>
                <p className="text-sm leading-relaxed text-foreground">{b.usp}</p>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <dt className="text-muted text-xs uppercase tracking-wider font-semibold">Owner</dt>
                  <dd className="text-right">{b.owner}</dd>
                  <dt className="text-muted text-xs uppercase tracking-wider font-semibold">Segment</dt>
                  <dd className="text-right text-xs">{b.segment}</dd>
                  <dt className="text-muted text-xs uppercase tracking-wider font-semibold">Amazon BSR</dt>
                  <dd className="text-right font-mono">{b.bsr}</dd>
                  <dt className="text-muted text-xs uppercase tracking-wider font-semibold">Kroger $/oz</dt>
                  <dd className="text-right font-mono font-semibold text-accent">{b.perOz}</dd>
                </dl>
                <p className="mt-3 text-xs text-muted">
                  <span className="font-semibold">Distribution:</span> {b.distribution}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-card-flagship border-l-4 border-accent rounded-r-xl p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-accent mb-2">Read</p>
            <p className="text-sm leading-relaxed">
              The legacy segment is dominated by corporate-backed brands (PepsiCo &rarr; Naked,
              Coca-Cola &rarr; Simply, Bolthouse Farms &rarr; Evolution Fresh) with unmatched
              distribution scale, while the challenger segment is anchored by two Smucker&rsquo;s-owned
              siblings (R.W. Knudsen + Santa Cruz Organic) that risk internal cannibalization at
              identical price points. Lakewood Organic is the only family-owned independent in the
              challenger set.
            </p>
          </div>
        </div>
      </section>

      {/* Section: Strategic Recommendations */}
      <section className="py-16 md:py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-sm font-bold uppercase tracking-wider text-accent">07</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Strategic Recommendations</h2>
          </div>
          <p className="text-muted max-w-3xl mb-10">
            What each cohort of brands should do next, ranked by urgency.
          </p>

          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-border p-6 sm:p-8">
              <h3 className="text-xl font-bold mb-4">For Cold Pressed Premium brands</h3>
              <p className="text-sm text-muted mb-5">Suja Organic &middot; Evolution Fresh</p>
              <div className="space-y-5 text-sm leading-relaxed">
                <div>
                  <p className="font-semibold mb-1">Fix Amazon listings immediately.</p>
                  <p className="text-muted">
                    Suja&rsquo;s current Amazon price of $21.31 vs its 30-day Keepa average of
                    $30.58, and Evolution Fresh&rsquo;s $45.01 vs $67.80 Keepa, indicate pricing
                    instability or third-party seller dominance. Both BSRs sit above 150,000 &mdash;
                    effectively invisible &mdash; while challenger R.W. Knudsen holds BSR #1,149 at
                    a comparable $8.96. Brand-direct storefronts with consistent pricing are a
                    prerequisite for digital channel recovery.
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Launch a 32oz cold pressed SKU at Kroger ($9.99&ndash;$10.99).</p>
                  <p className="text-muted">
                    The 32oz organic shelf at Kroger is owned entirely by challengers (Lakewood
                    $7.49, R.W. Knudsen $5.49). A 32oz cold pressed format would command a
                    justified premium over those non-HPP competitors while offering better
                    per-ounce value than current 11&ndash;12oz single-serves.
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Activate TikTok Shop as a first-mover.</p>
                  <p className="text-muted">
                    With 0 of 8 competitors currently on TikTok Shop, the cold pressed juice
                    category is entirely uncontested in social commerce. Suja&rsquo;s functional
                    ingredient story and Evolution Fresh&rsquo;s Starbucks equity are both
                    content-native narratives.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border p-6 sm:p-8">
              <h3 className="text-xl font-bold mb-4">For Mid-Tier Organic brands</h3>
              <p className="text-sm text-muted mb-5">Lakewood Organic &middot; R.W. Knudsen &middot; Santa Cruz Organic</p>
              <div className="space-y-5 text-sm leading-relaxed">
                <div>
                  <p className="font-semibold mb-1">Lakewood: reconcile Target pricing urgently.</p>
                  <p className="text-muted">
                    The $13.50 Target price vs $7.49 Kroger is an 80% premium that will drive
                    consumer rejection and channel conflict. Even if this reflects a case-price
                    estimation artifact, audit and align Target shelf pricing to within a
                    15&ndash;20% premium of Kroger (~$8.50&ndash;$9.00 would be defensible).
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-1">R.W. Knudsen: leverage the #1,149 BSR.</p>
                  <p className="text-muted">
                    Top-ranked brand in the set by BSR, but the estimated $1.73M annual revenue
                    comes from a single tracked SKU. Expand the Amazon catalog with Subscribe &amp;
                    Save bundles of trending functional SKUs (elderberry, beet, tart cherry) to
                    compound the advantage.
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Santa Cruz + R.W. Knudsen: differentiate at retail.</p>
                  <p className="text-muted">
                    Both Smucker&rsquo;s-owned brands price identically at Kroger ($5.49/32oz,
                    $0.17/oz) and share the same distribution &mdash; direct internal
                    cannibalization. Segment by format: Santa Cruz &rarr; lemonade and fruit-forward;
                    R.W. Knudsen &rarr; functional/wellness blends, with distinct shelf placement.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border p-6 sm:p-8">
              <h3 className="text-xl font-bold mb-4">For Mass-Market Legacy brands</h3>
              <p className="text-sm text-muted mb-5">Naked Juice &middot; Bolthouse Farms &middot; Simply</p>
              <div className="space-y-5 text-sm leading-relaxed">
                <div>
                  <p className="font-semibold mb-1">Naked Juice: pressure-test the Target discount.</p>
                  <p className="text-muted">
                    Naked&rsquo;s $3.19 Target price is a $0.60 discount versus its $3.79
                    Kroger/Ralphs price &mdash; the largest absolute discount to Target in the
                    dataset. Given Target&rsquo;s health-conscious shopper, evaluate whether the
                    discount drives incremental volume or just erodes margin, particularly as
                    Bolthouse prices at $3.49 at Kroger and could undercut further.
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Bolthouse Farms: rebuild Amazon presence.</p>
                  <p className="text-muted">
                    $2,950/month and BSR #75,276 is dramatically underperforming relative to retail
                    footprint. The 5-pack variety format at $61.99 is poorly optimized for impulse
                    purchase &mdash; a single-unit 52oz listing at ~$7.99 (matching Target) would
                    better align with consumer buying behavior on the platform.
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Simply: defend the value tier.</p>
                  <p className="text-muted">
                    Amazon dominance ($138,900/month, BSR #1,185) at $0.10/oz confirms the
                    value-tier NFC juice consumer is highly active online. The strategic question
                    is whether to extend the brand upward or fortify the floor with bundled
                    Subscribe &amp; Save offerings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 md:py-24 bg-foreground text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-accent text-white rounded-full mb-6">
            This was 1 of 30+ Gurus
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Want a report like this for your category?
          </h2>
          <p className="mt-4 text-lg text-white/70">
            The Competitive Pricing &amp; Attributes Guru is one of dozens of specialized AI
            advisors inside Babu &mdash; trained on 35+ years of CPG operating experience and
            thousands of expert resources from Jeff Church.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/babu-early"
              className="inline-flex items-center justify-center px-8 py-4 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-colors text-lg"
            >
              Get early access to Babu &rarr;
            </Link>
            <a
              href="mailto:info@teamchurch.co"
              className="inline-flex items-center justify-center px-8 py-4 border border-white/30 hover:border-white/60 text-white font-semibold rounded-lg transition-colors text-lg"
            >
              Talk to Jeff
            </a>
          </div>
          <p className="mt-6 text-xs text-white/40">
            Sample report. Data shown is illustrative; current category figures may have shifted.
          </p>
        </div>
      </section>
    </>
  );
}
