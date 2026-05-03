import { httpRouter } from "convex/server";
import { exportUserData, exportUserDataOptions } from "./export";

const http = httpRouter();

/**
 * OPTIONS /export-user-data — CORS preflight.
 * Browsers send this automatically before the GET because the request
 * carries an Authorization header (non-simple CORS request).
 */
http.route({
  path: "/export-user-data",
  method: "OPTIONS",
  handler: exportUserDataOptions,
});

/**
 * GET /export-user-data
 * Streams the authenticated user's data as a JSON download.
 * See convex/export.ts for the full envelope schema.
 */
http.route({
  path: "/export-user-data",
  method: "GET",
  handler: exportUserData,
});

export default http;
