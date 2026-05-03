import { readFile } from "fs/promises";
import path from "path";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";

type Frontmatter = {
  title: string;
  lastUpdated: string;
};

/**
 * Extract YAML frontmatter from a file without an external library.
 * Supports both MDX files (proper markdown) and files whose body is raw HTML
 * (e.g. content exported from Termly or FreePrivacyPolicy generators).
 */
function parseFrontmatter(source: string): {
  frontmatter: Frontmatter;
  body: string;
} {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: { title: "", lastUpdated: "" }, body: source };
  }

  const yaml = match[1];
  const body = match[2];

  const get = (key: string) =>
    yaml.match(new RegExp(`^${key}:\\s*(.+)$`, "m"))?.[1]?.trim() ?? "";

  return {
    frontmatter: { title: get("title"), lastUpdated: get("lastUpdated") },
    body,
  };
}

/**
 * Strip artifacts that policy generators (Termly, FreePrivacyPolicy) inject
 * into their HTML output but that are irrelevant — and fatal to MDX —
 * when pasted into a content file:
 *   • <style> blocks:  CSS curly-braces break MDX's acorn JS parser
 *   • <script> blocks: not needed and a potential XSS surface
 */
function stripGeneratorArtifacts(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "");
}

/**
 * Server component that reads an MDX/HTML file from content/legal/<filename>,
 * detects whether the body is raw HTML (from a policy generator) or proper
 * Markdown/MDX, and renders it accordingly.
 *
 * HTML bodies   → dangerouslySetInnerHTML after stripping <style>/<script>
 * Markdown bodies → compiled with next-mdx-remote compileMDX
 */
export async function LegalPage({ filename }: { filename: string }) {
  const filePath = path.join(process.cwd(), "content", "legal", filename);
  const source = await readFile(filePath, "utf-8");

  const { frontmatter, body } = parseFrontmatter(source);

  // Detect HTML: policy generators output files that start with <style> or
  // an HTML element. Proper MDX/Markdown starts with headings or plain text.
  const isHtml = /^\s*</.test(body);

  const formattedDate = frontmatter.lastUpdated
    ? new Date(frontmatter.lastUpdated).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  let mdxContent: React.ReactElement | null = null;
  if (!isHtml) {
    const { content } = await compileMDX<Frontmatter>({
      source,
      options: { parseFrontmatter: true },
    });
    mdxContent = content;
  }

  return (
    <div
      style={{
        background: "var(--bg-base)",
        minHeight: "100vh",
        paddingBottom: "4rem",
      }}
    >
      <div
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "2.5rem 1.5rem",
        }}
      >
        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm mb-8 transition-colors hover:underline"
          style={{ color: "var(--text-secondary)" }}
        >
          <span aria-hidden="true">←</span>
          <span>Back to app</span>
        </Link>

        {/* Page header */}
        <header
          className="mb-8"
          style={{
            borderBottom: "1px solid var(--border-subtle)",
            paddingBottom: "1.5rem",
          }}
        >
          {frontmatter.title && (
            <h1
              className="text-3xl font-semibold mb-2"
              style={{ color: "var(--text-primary)" }}
              data-testid="legal-page-title"
            >
              {frontmatter.title}
            </h1>
          )}
          {formattedDate && (
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              Last updated: {formattedDate}
            </p>
          )}
        </header>

        {/* Body */}
        {isHtml ? (
          <div
            className="legal-prose"
            dangerouslySetInnerHTML={{
              __html: stripGeneratorArtifacts(body),
            }}
          />
        ) : (
          <div className="legal-prose">{mdxContent}</div>
        )}
      </div>
    </div>
  );
}
