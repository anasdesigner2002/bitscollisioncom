import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticle } from "@/app/lib/blog";
import styles from "./Article.module.css";

// Article pages read straight from the URL: /blog/{username}/{slug} maps
// 1:1 onto the API's own /articles/{username}/{slug} lookup, so no id table
// or build-time list is needed. Nothing is prerendered - a page is rendered
// the first time someone opens it and then cached for a day, same as the
// feed it came from.
type Props = { params: Promise<{ username: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, slug } = await params;
  const article = await getArticle(username, slug);
  if (!article) return { title: "Article not found" };

  return {
    title: article.title,
    description: article.excerpt,
    // The author's own post is the original; pointing the canonical there
    // keeps this copy out of search results competing with it.
    alternates: { canonical: article.sourceUrl },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.image ? [article.image] : undefined,
      type: "article",
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { username, slug } = await params;
  const article = await getArticle(username, slug);
  if (!article) notFound();

  return (
    <main>
      <section className={`wa-p-relative tx-section ${styles.hero}`}>
        <div className="container nm-container-1">
          <div className={styles.meta}>
            <span className={styles.chip}>{article.category}</span>
            <span>{article.date}</span>
            {article.readingTime > 0 && <span>{article.readingTime} min read</span>}
          </div>

          <h1 className={styles.title}>{article.title}</h1>

          <div className={styles.byline}>
            {article.authorImage && <img src={article.authorImage} alt="" />}
            <span>
              <strong>{article.author}</strong>
              Published on DEV
            </span>
          </div>

          {article.image && (
            <div className={styles.cover}>
              <img src={article.image} alt="" />
            </div>
          )}

          <div className={styles.layout}>
            {/* dev.to's own rendered post body, scrubbed of scripts and
                inline handlers in lib/blog.ts before it gets here. */}
            <div
              className={styles.body}
              dangerouslySetInnerHTML={{ __html: article.bodyHtml }}
            />

            <aside className={styles.aside}>
              <h4>About this article</h4>
              <p>
                Written by {article.author} and first published on DEV. We surface it here as part of our
                daily programming reading list.
              </p>
              {article.tags.length > 0 && (
                <div className={styles.tags}>
                  {article.tags.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>
              )}
              <a
                className={styles.sourceLink}
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read the original
                <i className="fas fa-long-arrow-right" aria-hidden="true" />
              </a>
            </aside>
          </div>

          {/* Plain <a> like the rest of the site - every link here does a
              full page load, which is what the theme's GSAP/Lenis setup
              expects (see the same note in SiteHeader). */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a className={styles.backLink} href="/blog">
            <i className="fas fa-long-arrow-left" aria-hidden="true" />
            Back to all insights
          </a>
        </div>
      </section>
    </main>
  );
}
