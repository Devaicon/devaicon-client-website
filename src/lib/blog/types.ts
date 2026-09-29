// Shapes of blog content as the Express API sends it. Admin and public views
// share most of these; see server/src/lib/postView.js.

/** A node of the editor's document (Tiptap / ProseMirror JSON). */
export type DocNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: DocNode[];
  text?: string;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
};

export type PostStatus = "draft" | "scheduled" | "published";

export type Author = {
  id: string;
  name: string;
  type: "Person" | "Organization";
  jobTitle: string;
  bio: string;
  avatarUrl: string;
  links: string[];
};

export type Category = { id: string; name: string; slug: string; description: string };

export type CtaStyle = "panel" | "banner" | "inline";

export type Cta = {
  id: string;
  name: string;
  heading: string;
  body: string;
  buttonLabel: string;
  buttonUrl: string;
  style: CtaStyle;
};

export type Faq = { question: string; answer: string };

export type TocSettings = {
  enabled: boolean;
  depth: 2 | 3;
  title: string;
  labels: { id: string; text: string }[];
};

export type Seo = {
  metaTitle: string;
  metaDescription: string;
  focusKeyphrase: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  noindex: boolean;
};

export type PostSummary = {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  status: PostStatus;
  featured: boolean;
  publishedAt: string;
  updatedAt: string;
  updatedBy: string;
  readingMinutes: number;
  heroImage: { url: string; alt: string };
  tags: string[];
  noindex: boolean;
  author: { name: string } | null;
  category: { name: string; slug: string } | null;
};

/** The editor's copy of a post: references are ids. */
export type AdminPost = {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  previousSlugs: string[];
  categoryId: string;
  tags: string[];
  authorId: string;
  heroImage: { url: string; alt: string };
  body: DocNode;
  faqs: Faq[];
  closingCtaId: string;
  toc: TocSettings;
  seo: Seo;
  featured: boolean;
  status: PostStatus;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  readingMinutes: number;
};

/** A reader's copy of a post: references resolved. */
export type PublicPost = {
  title: string;
  subtitle: string;
  slug: string;
  tags: string[];
  heroImage: { url: string; alt: string };
  body: DocNode;
  faqs: Faq[];
  toc: TocSettings;
  seo: Seo;
  status: PostStatus;
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  author: Author | null;
  category: Category | null;
  closingCta: Cta | null;
  /** Every CTA the body places inline, by id. */
  ctas: Record<string, Cta>;
};
