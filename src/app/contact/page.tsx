"use client";

import { useState, type FormEvent } from "react";

const stages = [
  "Idea / Pre-launch",
  "Launched, under $100K",
  "$100K to $500K",
  "$500K to $1M",
  "$1M to $5M",
  "$5M to $10M",
  "$10M+",
];

const interests = [
  "90-Day Breakthrough",
  "VIP Day",
  "MBA for CPG",
  "Babu",
  "General question",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: wire up to form handler / email endpoint
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-6">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold">Thanks - we&rsquo;ll be in touch within 2 business days.</h1>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Get in touch.</h1>
          <p className="mt-4 text-lg text-muted">
            Tell us a bit about you and your brand - we&rsquo;ll get back within 2 business days.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label htmlFor="business" className="block text-sm font-medium mb-1">
              Business name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="business"
              name="business"
              required
              className="w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium mb-1">
              Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              placeholder="https://"
              className="w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label htmlFor="stage" className="block text-sm font-medium mb-1">
              Current stage <span className="text-red-500">*</span>
            </label>
            <select
              id="stage"
              name="stage"
              required
              defaultValue=""
              className="w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="" disabled>
                Select your stage
              </option>
              {stages.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="interest" className="block text-sm font-medium mb-1">
              What are you interested in? <span className="text-red-500">*</span>
            </label>
            <select
              id="interest"
              name="interest"
              required
              defaultValue=""
              className="w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="" disabled>
                Select an option
              </option>
              {interests.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-accent resize-y"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-colors"
          >
            Send message
          </button>
        </form>
      </div>
    </section>
  );
}
