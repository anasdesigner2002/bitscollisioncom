import SplitTitle from "@/app/components/shared/SplitTitle";
import FireflyAnim from "@/app/components/shared/FireflyAnim";
import PostGridCards from "@/app/components/widgets/PostGridCards";
import { getLatestArticles, type Article } from "@/app/lib/blog";
import { on, type Settings } from "@/app/lib/types";

// Shape the extraction script pre-resolved into `settings.resolved_posts`.
type ResolvedPost = {
  id: string;
  title: string;
  image: string;
  excerpt: string;
  date: string;
  category: string;
  slug: string;
};

// Ports tx-post-grid/views/view-1.php. The original ran a WP_Query over the
// demo export's own `post` items; the extraction script pre-resolved those
// into `settings.resolved_posts`. Those are three fixed 2024 posts, so this
// now pulls live software/tech articles instead (see lib/blog.ts, cached and
// revalidated daily) and keeps the extracted set purely as a fallback for
// when the feed can't be reached at build/revalidate time.
export default async function PostGrid({ settings }: { settings: Settings }) {
  const fallback: Article[] = (settings.resolved_posts || []).map((post: ResolvedPost) => ({
    id: String(post.id),
    title: post.title,
    image: post.image,
    excerpt: post.excerpt,
    date: post.date,
    category: post.category,
    href: "/blog",
    sourceUrl: "/blog",
    author: "",
    readingTime: 0,
    tags: [],
  }));

  const live = await getLatestArticles(3);
  const posts = live.length ? live : fallback;

  return (
    <section className="nm-blog-1-area wa-p-relative pt-110 pb-95 tx-section">
      {on(settings.enable_top_shape) && (
        <div className="nm-about-1-line">
          <div className="nm-about-1-line-border" />
          <div className="nm-about-1-line-plus">
            <span className="plus">+</span>
          </div>
        </div>
      )}

      {settings.image_1?.url && <FireflyAnim backgroundUrl={settings.image_1.url} />}
      {settings.image_2?.url && <FireflyAnim backgroundUrl={settings.image_2.url} variant="right" />}

      <div className="container nm-container-1">
        <div className="nm-blog-1-sec-title mb-50">
          <div className="left">
            {on(settings.enable_sub_title) && (
              <h6 className="nm-subtitle-1">
                <span className="dot" />
                <span className="text" dangerouslySetInnerHTML={{ __html: settings.sub_title }} />
              </h6>
            )}
            {on(settings.enable_title) && (
              <SplitTitle as="h2" className="tx-title nm-sec-title-1" html={settings.title} />
            )}
          </div>
          {on(settings.enable_description) && (
            <p className="nm-p-1 sec-disc tx-description" dangerouslySetInnerHTML={{ __html: settings.description }} />
          )}
        </div>

        <PostGridCards posts={posts} />
      </div>

      {on(settings.enable_bottom_shape) && (
        <div className="nm-about-1-line has-v2">
          <div className="nm-about-1-line-border" />
          <div className="nm-about-1-line-plus">
            <span className="plus">+</span>
          </div>
        </div>
      )}
    </section>
  );
}
