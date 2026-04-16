import type { Metadata } from "next";
import { VipAccordion } from "./vip-accordion";
import { CountdownTimer } from "./countdown-timer";

export const metadata: Metadata = {
  title: "You're Registered! - CPG Profitability Workshop",
  description:
    "You're in for the CPG Profitability Workshop on April 23rd. Add it to your calendar and upgrade to VIP for a private Q&A with Jeff Church.",
};

const calendarLink =
  "https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=Zmt1ajI0OTFoZXBmNTFpcWhla2hscjI4YTAgam9zaHVhQHRlYW1jaHVyY2guY28&tmsrc=joshua%40teamchurch.co";

const vipCheckoutLink = "https://learn.cpgfoundersgroup.com/offers/o26eJuGF";

export default function WorkshopConfirmationPage() {
  return (
    <>
      {/* ========== HERO ========== */}
      <section className="relative bg-foreground text-white overflow-hidden">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 text-green-400 mb-6">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-green-500/20 text-green-400 rounded-full mb-4">
            You&rsquo;re Registered!
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
            You&rsquo;re in! (2 more steps)
          </h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
            Welcome to the CPG Profitability Workshop: Reduce Your Burn and Get to Profitability
            Faster
          </p>
        </div>
      </section>

      {/* ========== STEP 1: CALENDAR ========== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-2 text-sm font-bold bg-foreground text-white rounded-full mb-6">
            Step 1
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Add it to your calendar
          </h2>
          <p className="mt-4 text-lg text-muted leading-relaxed">
            Don&rsquo;t miss it. Click below to add the workshop to your Google calendar so April
            23rd is locked in. The Zoom link will also be sent in your confirmation email.
          </p>
          <div className="mt-8">
            <a
              href={calendarLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg transition-colors text-lg"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Add to Google Calendar
            </a>
          </div>

          <div className="mt-10">
            <p className="text-sm text-muted mb-4">Workshop starts in:</p>
            <CountdownTimer targetDate="2026-04-23T09:00:00-07:00" />
          </div>
        </div>
      </section>

      {/* ========== STEP 2: VIP UPSELL ========== */}
      <section id="vip" className="py-16 md:py-24 bg-background scroll-mt-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-2 text-sm font-bold bg-foreground text-white rounded-full mb-6">
              Step 2
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Upgrade to VIP and Get Your Questions Answered by Jeff
            </h2>
            <p className="mt-2 text-accent font-semibold">
              Available to the first 25 founders only.
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 sm:p-8 md:p-10">
            <p className="text-lg text-muted leading-relaxed mb-6">
              You&rsquo;re registered for the free workshop. Here&rsquo;s one more opportunity
              before you go. We&rsquo;re offering 25 VIP tickets for founders who want more than
              just the training. VIP gets you access to a dedicated Day 2 session with Jeff Church
              the day after - a private, small-group Q&A where he will dig into your specific
              business, your numbers, and your exact situation.
            </p>

            <VipAccordion />

            <div className="mt-8 p-6 bg-card-flagship rounded-xl border border-accent/30 text-center">
              <p className="text-3xl font-bold">
                $97 <span className="text-base font-normal text-muted">one-time payment</span>
              </p>
              <p className="mt-1 text-sm text-muted">
                No upsells. No subscriptions. No hidden fees.
              </p>
              <div className="mt-6">
                <a
                  href={vipCheckoutLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-colors text-lg"
                >
                  Buy your $97 VIP ticket &rarr;
                </a>
              </div>
              <p className="mt-3 text-xs text-muted">
                Only 25 spots available. First come, first served.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
