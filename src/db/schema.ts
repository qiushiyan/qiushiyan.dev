import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const postViews = sqliteTable("post_views", {
  postSlug: text("post_slug").notNull().primaryKey(),
  viewCount: integer("view_count").notNull(),
});
