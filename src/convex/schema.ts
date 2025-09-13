import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // File management tables
    files: defineTable({
      name: v.string(),
      size: v.number(),
      type: v.string(),
      storageId: v.id("_storage"),
      uploadedBy: v.id("users"),
      isPublic: v.optional(v.boolean()),
      tags: v.optional(v.array(v.string())),
      description: v.optional(v.string()),
    })
      .index("by_user", ["uploadedBy"])
      .index("by_public", ["isPublic"]),

    contributions: defineTable({
      fileId: v.id("files"),
      contributorId: v.id("users"),
      type: v.union(v.literal("upload"), v.literal("share"), v.literal("comment")),
      message: v.optional(v.string()),
    })
      .index("by_file", ["fileId"])
      .index("by_contributor", ["contributorId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;