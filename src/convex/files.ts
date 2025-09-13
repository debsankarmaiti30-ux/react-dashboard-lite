import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

export const createFile = mutation({
  args: {
    name: v.string(),
    size: v.number(),
    type: v.string(),
    storageId: v.id("_storage"),
    isPublic: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("files", {
      ...args,
      uploadedBy: user._id,
    });
  },
});

export const getUserFiles = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    const files = await ctx.db
      .query("files")
      .withIndex("by_user", (q) => q.eq("uploadedBy", user._id))
      .collect();

    return Promise.all(
      files.map(async (file) => ({
        ...file,
        url: await ctx.storage.getUrl(file.storageId),
      }))
    );
  },
});

export const getPublicFiles = query({
  args: {},
  handler: async (ctx) => {
    const files = await ctx.db
      .query("files")
      .withIndex("by_public", (q) => q.eq("isPublic", true))
      .collect();

    return Promise.all(
      files.map(async (file) => {
        const uploader = await ctx.db.get(file.uploadedBy);
        return {
          ...file,
          url: await ctx.storage.getUrl(file.storageId),
          uploaderName: uploader?.name || "Anonymous",
        };
      })
    );
  },
});

export const deleteFile = mutation({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    const file = await ctx.db.get(args.fileId);
    if (!file || file.uploadedBy !== user._id) {
      throw new Error("File not found or unauthorized");
    }

    await ctx.storage.delete(file.storageId);
    await ctx.db.delete(args.fileId);
  },
});

export const getStorageStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return { totalFiles: 0, totalSize: 0 };
    }

    const files = await ctx.db
      .query("files")
      .withIndex("by_user", (q) => q.eq("uploadedBy", user._id))
      .collect();

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    
    return {
      totalFiles: files.length,
      totalSize,
    };
  },
});
