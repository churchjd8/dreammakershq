"use client";

import { useState } from "react";

const sections = [
  {
    title: "What you get with VIP",
    content: [
      "Access to the Day 2 private training and Q&A session with Jeff",
      "The chance to ask Jeff directly about your specific business and financials",
      "Capped at 25 attendees so everyone gets real time and real answers",
      "All three free tools from the main workshop included",
    ],
  },
  {
    title: "When is the VIP Session?",
    content:
      "The VIP Session will be the day after the workshop, Friday, April 24th at 9am PT.",
  },
  {
    title: "How much is the VIP Upgrade?",
    content:
      "The VIP upgrade is a one-time payment of $97. That gets you access to the private Day 2 training and small-group Q&A session with Jeff Church - capped at 25 attendees so everyone gets real time and real answers. There are no upsells, no subscriptions, and no hidden fees. Pay once, show up, and get your questions answered.",
  },
];

export function VipAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border">
      {sections.map((section, i) => (
        <div key={section.title} className="py-4">
          <button
            className="flex w-full items-center justify-between text-left"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            aria-expanded={openIndex === i}
          >
            <span className="text-base font-semibold pr-4">{section.title}</span>
            <svg
              className={`h-5 w-5 flex-shrink-0 text-muted transition-transform ${
                openIndex === i ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {openIndex === i && (
            <div className="mt-3 pr-8">
              {Array.isArray(section.content) ? (
                <ul className="space-y-2">
                  {section.content.map((item) => (
                    <li key={item} className="flex gap-2 text-muted">
                      <span className="text-accent font-bold">&#10003;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted leading-relaxed">{section.content}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
