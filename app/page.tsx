import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

/**
 * Root page — redirects to /dashboard if authenticated, /sign-in otherwise.
 */
export default async function RootPage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  } else {
    redirect("/sign-in");
  }
}
