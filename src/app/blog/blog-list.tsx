"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import type { BlogPost } from "@/lib/blog";

export function BlogList({
  posts,
  postsPerPage,
}: {
  posts: BlogPost[];
  postsPerPage: number;
}) {
  const [page, setPage] = useState(1);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Collect all unique tags sorted alphabetically
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, [posts]);

  const featuredPost = posts.find((p) => p.featured);
  const regularPosts = posts.filter((p) => !p.featured);

  // Filter by active tag
  const filteredPosts = activeTag
    ? regularPosts.filter((p) => p.tags.includes(activeTag))
    : regularPosts;

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (page - 1) * postsPerPage,
    page * postsPerPage
  );

  // Show featured post only on page 1 when no tag filter is active
  const showFeatured = featuredPost && page === 1 && !activeTag;

  // Also check if featured post matches active tag filter
  const showFilteredFeatured =
    featuredPost &&
    activeTag &&
    page === 1 &&
    featuredPost.tags.includes(activeTag);

  return (
    <>
      {/* Tag filters */}
      {allTags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => {
              setActiveTag(null);
              setPage(1);
            }}
            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
              activeTag === null
                ? "bg-accent text-white"
                : "border border-border text-muted hover:bg-card hover:text-foreground"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setActiveTag(tag === activeTag ? null : tag);
                setPage(1);
              }}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors capitalize ${
                tag === activeTag
                  ? "bg-accent text-white"
                  : "border border-border text-muted hover:bg-card hover:text-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Featured post */}
      {(showFeatured || showFilteredFeatured) && featuredPost && (
        <Link
          href={`/blog/${featuredPost.slug}`}
          className="group block rounded-xl border border-accent/30 ring-2 ring-accent/20 bg-card overflow-hidden hover:shadow-lg transition-shadow mb-10"
        >
          <div className="grid md:grid-cols-2">
            {featuredPost.image && (
              <div className="relative aspect-[16/9] md:aspect-auto md:min-h-[360px] overflow-hidden">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="p-6 sm:p-8 flex flex-col justify-center">
              <span className="inline-block self-start px-3 py-1 text-xs font-bold uppercase tracking-wider bg-accent text-white rounded-full mb-4">
                Featured
              </span>
              <div className="flex items-center gap-3 text-xs text-muted mb-3">
                <time dateTime={featuredPost.date}>
                  {new Date(featuredPost.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span>&middot;</span>
                <span>{featuredPost.readingTime}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold group-hover:text-accent transition-colors">
                {featuredPost.title}
              </h2>
              <p className="mt-3 text-muted line-clamp-3">
                {featuredPost.description}
              </p>
              {featuredPost.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {featuredPost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs bg-background rounded-full text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Link>
      )}

      {/* Regular posts grid */}
      {paginatedPosts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {paginatedPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
            >
              {post.image && (
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-muted mb-3">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span>&middot;</span>
                  <span>{post.readingTime}</span>
                </div>
                <h2 className="text-lg font-bold group-hover:text-accent transition-colors">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-muted line-clamp-3">
                  {post.description}
                </p>
                {post.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs bg-background rounded-full text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        activeTag && (
          <p className="text-muted text-center py-12">
            No posts found for &ldquo;{activeTag}&rdquo;.{" "}
            <button
              onClick={() => {
                setActiveTag(null);
                setPage(1);
              }}
              className="text-accent hover:underline"
            >
              View all posts
            </button>
          </p>
        )
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <button
            onClick={() => {
              setPage((p) => Math.max(1, p - 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            disabled={page === 1}
            className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-card transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            &larr; Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                p === page
                  ? "bg-accent text-white"
                  : "border border-border hover:bg-card"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => {
              setPage((p) => Math.min(totalPages, p + 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-card transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next &rarr;
          </button>
        </div>
      )}
    </>
  );
}
