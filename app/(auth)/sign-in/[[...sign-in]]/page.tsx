import { SignIn } from "@clerk/nextjs";
import { clerkDarkAppearance } from "@/lib/clerk-appearance";

export default function SignInPage() {
  return <SignIn appearance={clerkDarkAppearance} />;
}
