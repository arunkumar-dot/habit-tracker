/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as checkIns from "../checkIns.js";
import type * as completions from "../completions.js";
import type * as crons from "../crons.js";
import type * as habits from "../habits.js";
import type * as insights from "../insights.js";
import type * as milestones from "../milestones.js";
import type * as notifications from "../notifications.js";
import type * as pomodoro from "../pomodoro.js";
import type * as pushTokens from "../pushTokens.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  checkIns: typeof checkIns;
  completions: typeof completions;
  crons: typeof crons;
  habits: typeof habits;
  insights: typeof insights;
  milestones: typeof milestones;
  notifications: typeof notifications;
  pomodoro: typeof pomodoro;
  pushTokens: typeof pushTokens;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
