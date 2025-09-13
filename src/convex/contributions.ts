import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const addContribution = mutation({
  args: {
    fileId: v.id("files"),
    type: v.union(v.literal("upload"), v.literal("share"), v.literal("comment")),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("contributions", {
      ...args,
      contributorId: user._id,
    });
  },
});

export const getUserContributions = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    const contributions = await ctx.db
      .query("contributions")
      .withIndex("by_contributor", (q) => q.eq("contributorId", user._id))
      .collect();

    return Promise.all(
      contributions.map(async (contribution) => {
        const file = await ctx.db.get(contribution.fileId);
        return {
          ...contribution,
          fileName: file?.name || "Unknown file",
        };
      })
    );
  },
});
