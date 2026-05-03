/**
 * downloadUserDataExport
 *
 * Fetches the user's full data export from the Convex HTTP action and
 * triggers a browser file download. Call this from a "use client" component.
 *
 * @param getToken - Clerk's `getToken()` from `useAuth()`. Passed as a
 *   parameter so this helper remains a plain async function rather than a
 *   React hook — easier to test and reuse across components.
 *
 * Throws with a descriptive message on auth failure or non-200 response.
 */
export async function downloadUserDataExport(
  getToken: (opts?: { template?: string }) => Promise<string | null>
): Promise<void> {
  // ── 1. Get Convex-compatible Clerk JWT ────────────────────────────────────
  // Must use template: "convex" so the JWT carries the correct audience claim
  // that Convex expects — plain getToken() returns a Clerk session token whose
  // aud != "convex" and Convex will reject it with a 401.
  const token = await getToken({ template: "convex" });
  if (!token) {
    throw new Error("Not authenticated — please sign in and try again.");
  }

  // ── 2. Fetch the export from the Convex HTTP action ───────────────────────
  const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
  if (!convexSiteUrl) {
    throw new Error("NEXT_PUBLIC_CONVEX_SITE_URL is not set.");
  }

  const response = await fetch(`${convexSiteUrl}/export-user-data`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Export failed (${response.status}${text ? `: ${text}` : ""})`
    );
  }

  // ── 3. Trigger browser download via Blob + temporary <a> ─────────────────
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  // Extract filename from Content-Disposition header if present
  const disposition = response.headers.get("Content-Disposition") ?? "";
  const filenameMatch = disposition.match(/filename="([^"]+)"/);
  const filename = filenameMatch?.[1] ?? `habitflow-export-${todayDate()}.json`;

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  // Release the object URL after a short delay to let the download start
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}
