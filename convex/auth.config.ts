/**
 * Convex authentication configuration.
 * Declares Clerk as the JWT issuer so Convex can validate tokens
 * on every authenticated query and mutation.
 *
 * SETUP: Set CLERK_JWT_ISSUER_DOMAIN in .env.local to your Clerk
 * Frontend API URL (e.g. https://verb-noun-00.clerk.accounts.dev)
 */
export default {
  providers: [
    {
      domain: "https://decent-stag-2.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};
