"use client";

import { useState, type FormEvent } from "react";

export function BlogNewsletterForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = new FormData(form);
    const first_name = data.get("first_name") as string;
    const last_name = data.get("last_name") as string;
    const email = data.get("email") as string;

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, first_name, last_name }),
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="mt-4 text-lg font-semibold text-accent">
        You&rsquo;re in. Check your inbox.
      </p>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 max-w-sm mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            name="first_name"
            required
            placeholder="First name"
            className="flex-1 px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent text-sm"
          />
          <input
            type="text"
            name="last_name"
            required
            placeholder="Last name"
            className="flex-1 px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent text-sm"
          />
        </div>
        <input
          type="email"
          name="email"
          required
          placeholder="you@yourbrand.com"
          className="px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent text-sm"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-6 py-3 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-colors disabled:opacity-50 text-sm"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe to the newsletter"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-3 text-sm text-red-400">Something went wrong. Please try again.</p>
      )}
    </>
  );
}
