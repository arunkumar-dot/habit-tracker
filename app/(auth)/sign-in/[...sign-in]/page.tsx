import { Suspense } from "react";
import { SignInContent } from "../sign-in-content";
import { AccountDeletedBanner } from "../account-deleted-banner";

export default function SignInSubPage() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Suspense>
        <AccountDeletedBanner />
      </Suspense>
      <SignInContent />
    </div>
  );
}
