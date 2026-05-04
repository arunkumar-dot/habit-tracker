// Opt this route out of static prerendering — the page uses Convex hooks that
// require a runtime CONVEX_URL and is intentionally dev-only.
export const dynamic = "force-dynamic";

export default function AdminRemindersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
