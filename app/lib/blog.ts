// Live feed for the blog/insights section.
//
// The demo content that shipped with the theme is three hard-coded 2024
// posts, so the section went stale the day it was built. It now reads from
// the dev.to (Forem) public API instead - no API key, no sign-up, and every
// article carries the two things this site needs and most free news APIs
// don't hand out: a cover image and the full article body.
//
// One request per render, not one per topic: `tag=programming&top=7` returns
// the week's best-received programming articles. Fanning out over several
// tags got the build rate-limited (429s) once four prerendered routes each
// asked for four tags at once, and one tag-scoped query is what keeps the
// feed on-topic anyway - `programming` is a hard filter applied by dev.to,
// not a preference applied here.
//
// Responses are cached for a day (`revalidate: 86400`), which is the
// "updates daily" cadence the section is after - pages stay static, Next
// just refreshes them in the background once a day.

// Only the fields this site reads - Forem returns a good deal more.
type ForemArticle = {
  id: number;
  title: string;
  description: string;
  url: string;
  slug: string;
  cover_image: string | null;
  published_at: string;
  reading_time_minutes: number;
  language?: string;
  // Forem swaps these two between endpoints: the feed returns `tag_list` as
  // an array and `tags` as a comma string, the single-article endpoint does
  // the exact opposite. tagsOf() normalises both.
  tag_list?: string[] | string;
  tags?: string[] | string;
  body_html?: string;
  user?: { name?: string; username?: string; profile_image?: string };
};

export type Article = {
  id: string;
  title: string;
  image: string;
  excerpt: string;
  date: string;
  category: string;
  /** Route on this site that renders the article. */
  href: string;
  /** The article's own page on dev.to, for attribution and canonical. */
  sourceUrl: string;
  author: string;
  readingTime: number;
  /** Every tag the post carries - `category` is just the most telling one. */
  tags: string[];
};

export type ArticleDetail = Article & {
  bodyHtml: string;
  authorImage: string;
  authorUsername: string;
};

const API = "https://dev.to/api/articles";
const FEED = `${API}?tag=programming&top=7&per_page=40`;
const DAY_IN_SECONDS = 86400;

// dev.to's `programming` tag still carries the occasional careers or
// watercooler post. Anything tagged with one of these is dropped, however
// well it did that week.
const OFF_TOPIC_TAGS = new Set([
  "business",
  "career",
  "hiring",
  "interview",
  "jobhunting",
  "jobs",
  "life",
  "marketing",
  "mentalhealth",
  "meta",
  "motivation",
  "offtopic",
  "remote",
  "watercooler",
  "writing",
]);

// Concrete languages, frameworks and disciplines. Used to pick the label on
// the card ("Rust" says more than "Programming") and to rank posts that name
// a specific technology above general-purpose commentary.
const TECH_TAGS = new Set([
  "algorithms",
  "android",
  "angular",
  "api",
  "architecture",
  "aws",
  "azure",
  "cpp",
  "csharp",
  "css",
  "database",
  "devops",
  "django",
  "docker",
  "dotnet",
  "flutter",
  "git",
  "go",
  "golang",
  "graphql",
  "html",
  "ios",
  "java",
  "javascript",
  "kotlin",
  "kubernetes",
  "laravel",
  "linux",
  "machinelearning",
  "nextjs",
  "node",
  "nodejs",
  "performance",
  "php",
  "postgres",
  "python",
  "react",
  "reactnative",
  "ruby",
  "rails",
  "rust",
  "security",
  "sql",
  "swift",
  "testing",
  "typescript",
  "vue",
  "webdev",
]);

// Tags are lowercase slugs; these are the ones where naive capitalisation
// reads wrong. Anything else just gets its first letter upper-cased.
const TAG_LABELS: Record<string, string> = {
  ai: "AI",
  api: "API",
  aws: "AWS",
  cpp: "C++",
  csharp: "C#",
  css: "CSS",
  devops: "DevOps",
  dotnet: ".NET",
  github: "GitHub",
  golang: "Go",
  graphql: "GraphQL",
  html: "HTML",
  ios: "iOS",
  javascript: "JavaScript",
  machinelearning: "Machine Learning",
  nextjs: "Next.js",
  node: "Node.js",
  nodejs: "Node.js",
  opensource: "Open Source",
  php: "PHP",
  postgres: "PostgreSQL",
  reactnative: "React Native",
  saas: "SaaS",
  sql: "SQL",
  typescript: "TypeScript",
  ui: "UI",
  uidesign: "UI Design",
  ux: "UX",
  webdev: "Web Dev",
};

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function label(tag: string): string {
  return TAG_LABELS[tag] || tag.charAt(0).toUpperCase() + tag.slice(1);
}

function trimWords(text: string, words: number): string {
  const parts = text.trim().split(/\s+/);
  if (parts.length <= words) return text.trim();
  return `${parts.slice(0, words).join(" ")}...`;
}

function tagsOf(post: ForemArticle): string[] {
  const raw = [post.tag_list, post.tags].find((value) => value !== undefined && value !== null);
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") return raw.split(",").map((tag) => tag.trim()).filter(Boolean);
  return [];
}

function toArticle(post: ForemArticle): Article {
  const tags = tagsOf(post);
  const username = post.user?.username || "";

  return {
    id: String(post.id),
    title: post.title,
    // Cover-less posts are filtered out before this runs (the card layout
    // needs an image), so the fallback is only here to satisfy the type.
    image: post.cover_image || "",
    excerpt: trimWords(post.description || "", 22),
    date: DATE_FORMAT.format(new Date(post.published_at)),
    category: label(tags.find((tag) => TECH_TAGS.has(tag)) || "programming"),
    // Mirrors the API's own /articles/{username}/{slug} lookup, so the
    // article page can resolve straight from the URL with no id table.
    href: `/blog/${username}/${post.slug}`,
    sourceUrl: post.url,
    author: post.user?.name || "dev.to",
    readingTime: post.reading_time_minutes || 0,
    tags,
  };
}

// One retry on a 429: at build time several prerendered routes ask for this
// feed at roughly the same moment, before any of them has populated the data
// cache, which is exactly when dev.to pushes back.
async function get(url: string, attempt = 0): Promise<Response> {
  const response = await fetch(url, {
    headers: { Accept: "application/vnd.forem.api-v1+json" },
    next: { revalidate: DAY_IN_SECONDS },
  });
  if (response.status === 429 && attempt === 0) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return get(url, attempt + 1);
  }
  return response;
}

export async function getLatestArticles(limit: number): Promise<Article[]> {
  let feed: ForemArticle[];
  try {
    const response = await get(FEED);
    if (!response.ok) throw new Error(`dev.to responded ${response.status}`);
    const data = await response.json();
    feed = Array.isArray(data) ? data : [];
  } catch (error) {
    // Never let the feed take a page down with it - callers fall back to
    // their own content when this comes back empty.
    console.error(`[blog] ${error instanceof Error ? error.message : error}`);
    return [];
  }

  const usable = feed.filter((post) => {
    const tags = tagsOf(post);
    return (
      Boolean(post?.id && post?.title && post?.cover_image && post?.slug && post?.user?.username) &&
      (post.language ?? "en") === "en" &&
      !tags.some((tag) => OFF_TOPIC_TAGS.has(tag))
    );
  });

  // Posts naming a specific technology first, then the rest, each newest
  // first - so the cards lead with "Rust"/"React" over generic commentary.
  const byDate = (a: ForemArticle, b: ForemArticle) =>
    Date.parse(b.published_at) - Date.parse(a.published_at);
  const specific = usable.filter((post) => tagsOf(post).some((tag) => TECH_TAGS.has(tag))).sort(byDate);
  const general = usable.filter((post) => !tagsOf(post).some((tag) => TECH_TAGS.has(tag))).sort(byDate);

  return [...specific, ...general].slice(0, limit).map(toArticle);
}

// Belt-and-braces pass over body HTML before it goes through
// dangerouslySetInnerHTML. Forem sanitizes what it renders, but this content
// is user-authored and arrives from a third party, so scripts, inline event
// handlers and `javascript:` URLs are stripped here too rather than trusted.
function sanitize(html: string): string {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe\b[^>]*\bsrc\s*=\s*["']?javascript:[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '$1="#"');
}

export async function getArticle(username: string, slug: string): Promise<ArticleDetail | null> {
  try {
    const response = await get(`${API}/${encodeURIComponent(username)}/${encodeURIComponent(slug)}`);
    if (!response.ok) return null;

    const post: ForemArticle = await response.json();
    if (!post?.id || !post.body_html) return null;

    return {
      ...toArticle(post),
      bodyHtml: sanitize(post.body_html),
      authorImage: post.user?.profile_image || "",
      authorUsername: post.user?.username || username,
    };
  } catch (error) {
    console.error(`[blog] ${error instanceof Error ? error.message : error}`);
    return null;
  }
}
