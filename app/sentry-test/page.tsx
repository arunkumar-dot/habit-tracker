import { redirect } from "next/navigation";
import SentryTestClient from "./sentry-test-client";

// Gate entirely to non-production environments at the server level.
export default function SentryTestPage() {
  if (process.env.NODE_ENV === "production") {
    redirect("/");
  }

  return <SentryTestClient />;
}
