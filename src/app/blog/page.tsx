import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog - CPG Founders Group",
  description:
    "Insights on fundraising, retail, margins, and scaling CPG brands from Jeff Church and the CPG Founders Group.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const featuredPost = posts.find((p) => p.featured);
  const regularPosts = posts.filter((p) => !p.featured);

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Blog</h1>
          <p className="mt-4 text-lg text-muted">
            Insights on fundraising, retail, margins, and scaling CPG brands from Jeff Church and the
            CPG Founders Group.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-muted">No posts yet. Check back soon.</p>
        ) : (
          <>
            {/* Featured post */}
            {featuredPost && (
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group block rounded-xl border border-accent/30 ring-2 ring-accent/20 bg-card overflow-hidden hover:shadow-lg transition-shadow mb-10"
              >
                <div className="grid md:grid-cols-2">
                  {featuredPost.image && (
                    <div className="relative aspect-[16/9] md:aspect-auto overflow-hidden">
                      <Image
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
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
                    <p className="mt-3 text-muted line-clamp-3">{featuredPost.description}</p>
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

            {/* Regular posts */}
            {regularPosts.length > 0 && (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {regularPosts.map((post) => (
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
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
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
                      <p className="mt-2 text-sm text-muted line-clamp-3">{post.description}</p>
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
            )}
          </>
        )}
      </div>
    </section>
  );
}
