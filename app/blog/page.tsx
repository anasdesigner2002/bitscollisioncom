import type { Metadata } from "next";
import PageBreadcrumb from "@/app/components/shared/PageBreadcrumb";
import { getLatestArticles, type Article } from "@/app/lib/blog";
import BlogSearchForm from "./BlogSearchForm";
import styles from "./Blog.module.css";

export const metadata: Metadata = {
  title: "Insights",
  description: "A daily-refreshed pick of the best programming writing from across the developer community.",
};

// Ports index.php + post-formats/content.php's list-view archive
// (.tz-blog-item.list-view-item) plus sidebar.php's `dynamic_sidebar(
// 'blog-sidebar' )` (search / categories / recent posts / tags widgets,
// styled via .tz-sidebar-widget in nimo-extra.css).
//
// The four demo posts this was built from were static 2024 entries with
// placeholder Latin excerpts, so the page went stale the day it shipped. The
// layout is unchanged; what fills it now is the live programming feed (see
// lib/blog.ts, revalidated daily), with the sidebar's categories, recent
// posts and tags all derived from that same set instead of hard-coded lists.
// Each entry opens on this site at /blog/{username}/{slug}.
export default async function BlogPage() {
  const articles = await getLatestArticles(12);
  const recentPosts = articles.slice(0, 3);

  // Sidebar categories: the card label already resolves each post's most
  // meaningful tag (lib/blog.ts), so counting those gives a category list
  // that matches what a reader sees on the cards.
  const categories = Object.entries(
    articles.reduce<Record<string, number>>((counts, post) => {
      counts[post.category] = (counts[post.category] || 0) + 1;
      return counts;
    }, {}),
  ).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  // Popular tags come from the posts' full tag lists rather than the derived
  // category, so this widget shows something the Topics list above doesn't -
  // most-used first, and only tags that appear on more than one post.
  const tagCounts = articles.reduce<Record<string, number>>((counts, post) => {
    post.tags.forEach((tag) => {
      counts[tag] = (counts[tag] || 0) + 1;
    });
    return counts;
  }, {});
  const popularTags = Object.entries(tagCounts)
    .filter(([tag, count]) => count > 1 && tag !== "programming")
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 12)
    .map(([tag]) => tag);

  return (
    <main>
      <PageBreadcrumb title="Blog" current="Blog" />
      <div className="tx-blog-area tz-blog-list-sec pt-110 pb-120 fix">
        <div className="container nm-container-1">
          {articles.length === 0 ? (
            <p className={`nm-p-1 ${styles.empty}`}>
              The feed is taking a breather right now &ndash; please check back shortly.
            </p>
          ) : (
            <div className="row">
              <div className="col-xxl-8 col-xl-8 col-lg-8">
                <div className="blog__wrapper blog-list-content mt-none-30">
                  {articles.map((post) => (
                    <article key={post.id} className="tx-blog-box mt-30">
                      <div className={`tz-blog-item list-view-item ${styles.listItem}`}>
                        <div className="item-img">
                          <img src={post.image} alt="" className="img-responsive w-100" loading="lazy" />
                        </div>
                        <div className="item-text headline pera-content">
                          <div className="item-meta">
                            <span>
                              <i className="fa-regular fa-calendar" /> {post.date}
                            </span>
                            <span>
                              <i className="fa-regular fa-user" /> {post.author}
                            </span>
                            {post.readingTime > 0 && (
                              <span>
                                <i className="fa-regular fa-clock" /> {post.readingTime} min read
                              </span>
                            )}
                          </div>
                          <h3 className="blog_title">{post.title}</h3>
                          <p className={styles.excerpt}>{post.excerpt}</p>
                          {/* Decoration: the whole card is the link (below),
                              so this stays a span and doesn't become a second
                              anchor to the same place. */}
                          <span className="read_more">
                            Read More <i className="fa-solid fa-angles-right" />
                          </span>
                        </div>
                        <a className="card-link" href={post.href} aria-label={post.title} />
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="col-xxl-4 col-xl-4 col-lg-4 mt-30 mt-lg-0">
                <div className="tx-sidebarWrapper tz-ser-sidebar">
                  <div className="tz-sidebar-widget search-widget">
                    <h3 className="widget-title">Search</h3>
                    <BlogSearchForm />
                  </div>

                  <div className="tz-sidebar-widget">
                    <h3 className="widget-title">Topics</h3>
                    <ul className="category-widget list-unstyled mb-0 pl-0">
                      {categories.map(([name, count]) => (
                        <li key={name}>
                          <span className={styles.categoryRow}>
                            <span>{name}</span>
                            <span>({count})</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="tz-sidebar-widget">
                    <h3 className="widget-title">Recent Posts</h3>
                    {recentPosts.map((post: Article) => (
                      <div className="tz-rcw-item" key={post.id}>
                        <div className="item-img">
                          <img src={post.image} alt="" loading="lazy" />
                        </div>
                        <div className="item-text">
                          <div className="item-meta">
                            <span>
                              <i className="fa-regular fa-calendar" /> {post.date}
                            </span>
                          </div>
                          <h3>
                            <a href={post.href} aria-label={post.title}>
                              {post.title}
                            </a>
                          </h3>
                        </div>
                      </div>
                    ))}
                  </div>

                  {popularTags.length > 0 && (
                    <div className="tz-sidebar-widget">
                      <h3 className="widget-title">Popular Tags</h3>
                      <ul className="tag-widget list-unstyled mb-0 pl-0 d-flex flex-wrap">
                        {popularTags.map((tag) => (
                          <li key={tag}>
                            <span className={styles.tag}>#{tag}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
