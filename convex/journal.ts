import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { getAuthUser, getOptionalAuthUser } from "./lib/auth";

// Returns "YYYY-MM-DD" in local time (same convention as the rest of the app)
function todayDate(): string {
  return new Date().toLocaleDateString("en-CA");
}

// Validates "YYYY-MM-DD" format and that the date is a real calendar date
function isValidISODate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const d = new Date(date + "T00:00:00");
  return !isNaN(d.getTime());
}

// ============================================
// QUERIES
// ============================================

/**
 * Returns today's journal entry for the authenticated user, or null.
 * Equivalent to: GET /api/journal/today
 */
export const getToday = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    const date = todayDate();

    const entry = await ctx.db
      .query("journalEntries")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", user._id).eq("date", date)
      )
      .unique();

    return { entry };
  },
});

/**
 * Returns paginated journal entries for the authenticated user, newest first.
 * Equivalent to: GET /api/journal/entries?cursor=<cursor>&limit=10
 *
 * Uses Convex native pagination. Pass `paginationOpts.cursor` from the previous
 * page's `continueCursor` to fetch the next page. `isDone` signals the last page.
 */
export const listEntries = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    return await ctx.db
      .query("journalEntries")
      .withIndex("by_user_date", (q) => q.eq("userId", user._id))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

/**
 * Returns the journal entry for a specific date, or null.
 * Equivalent to: GET /api/journal/entry/:date
 */
export const getByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    if (!isValidISODate(args.date)) {
      throw new Error("date must be a valid ISO date string (YYYY-MM-DD)");
    }

    const user = await getAuthUser(ctx);

    const entry = await ctx.db
      .query("journalEntries")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", user._id).eq("date", args.date)
      )
      .unique();

    return { entry };
  },
});

/**
 * Returns the first journal entry found at one of the provided candidate dates,
 * in the order given. Used by the "Then" memory feature — caller passes dates
 * in priority order (30d ago, 60d ago, 90d ago, 180d ago, 365d ago).
 *
 * Returns { entry } where entry is the first match, or null if none found.
 */
export const getThenMemory = query({
  args: { candidateDates: v.array(v.string()) },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    for (const date of args.candidateDates) {
      if (!isValidISODate(date)) continue;
      const entry = await ctx.db
        .query("journalEntries")
        .withIndex("by_user_date", (q) =>
          q.eq("userId", user._id).eq("date", date)
        )
        .unique();
      if (entry) return { entry };
    }

    return { entry: null };
  },
});

// ============================================
// MUTATIONS
// ============================================

/**
 * Create or update a journal entry for a given date.
 * If an entry already exists for this user+date, the content is updated (upsert).
 * Equivalent to: POST /api/journal
 */
export const upsertEntry = mutation({
  args: {
    content: v.string(),
    date: v.optional(v.string()),
    source: v.optional(v.union(v.literal("journal"), v.literal("dashboard"))),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    // Validate content
    const content = args.content.trim();
    if (!content) {
      throw new Error("content must be a non-empty string");
    }
    if (content.length > 5000) {
      throw new Error("content must not exceed 5000 characters");
    }

    // Resolve and validate date
    const date = args.date ?? todayDate();
    if (!isValidISODate(date)) {
      throw new Error("date must be a valid ISO date string (YYYY-MM-DD)");
    }
    if (date > todayDate()) {
      throw new Error("date must not be in the future");
    }

    const source = args.source ?? "journal";
    const now = Date.now();

    // Check for existing entry (enforces one entry per user+date)
    const existing = await ctx.db
      .query("journalEntries")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", user._id).eq("date", date)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { content, source, updatedAt: now });
      return { entry: { ...existing, content, source, updatedAt: now } };
    }

    const id = await ctx.db.insert("journalEntries", {
      userId: user._id,
      date,
      content,
      source,
      createdAt: now,
      updatedAt: now,
    });

    return {
      entry: { _id: id, userId: user._id, date, content, source, createdAt: now, updatedAt: now },
    };
  },
});
