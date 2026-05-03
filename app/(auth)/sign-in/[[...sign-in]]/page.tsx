import { SignIn } from "@clerk/nextjs";
import { clerkDarkAppearance } from "@/lib/clerk-appearance";

interface SignInPageProps {
  searchParams: Promise<{ accountDeleted?: string }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const accountDeleted = params.accountDeleted === "true";

  return (
    <div className="flex flex-col items-center gap-4">
      {accountDeleted && (
        <div
          className="w-full max-w-sm rounded-lg px-4 py-3 text-sm text-center"
          style={{
            background: "color-mix(in srgb, var(--accent) 12%, transparent)",
            border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
            color: "var(--text-primary)",
          }}
          role="status"
        >
          Your account has been deleted.
        </div>
      )}
      <SignIn appearance={clerkDarkAppearance} />
    </div>
  );
}
