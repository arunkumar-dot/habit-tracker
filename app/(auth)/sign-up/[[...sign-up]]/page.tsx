import { SignUp } from "@clerk/nextjs";
import { clerkDarkAppearance } from "@/lib/clerk-appearance";

export default function SignUpPage() {
  return <SignUp appearance={clerkDarkAppearance} />;
}
