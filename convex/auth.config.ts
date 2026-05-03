/**
 * Convex authentication configuration.
 * Declares Clerk as the JWT issuer so Convex can validate tokens
 * on every authenticated query and mutation.
 *
 * SETUP: Set CLERK_JWT_ISSUER_DOMAIN in Convex env to your Clerk
 * Frontend API URL.
 *   - Dev: https://verb-noun-00.clerk.accounts.dev
 *   - Prod: https://clerk.tryhabitflow.com
 *
 * Set with:
 *   npx convex env set CLERK_JWT_ISSUER_DOMAIN <url>          (dev)
 *   npx convex env set CLERK_JWT_ISSUER_DOMAIN <url> --prod   (prod)
 */
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
      applicationID: "convex",
    },
  ],
};