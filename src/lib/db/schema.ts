// src/lib/db/schema.ts
import { pgTable, text, timestamp, boolean, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  hashedPassword: text("hashed_password").notNull(),
  role: text("role", { enum: ["free", "professional", "business"] }).default("free"),
  emailVerified: timestamp("email_verified"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
});

export const styles = pgTable("style", {
  id: text("id").primaryKey(), // Changed from uuid to text
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const images = pgTable("image", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  projectId: uuid("project_id")
    .references(() => projects.id, { onDelete: "set null" }),
  originalUrl: text("original_url").notNull(),
  processedUrl: text("processed_url"),
  styleId: text("style_id"),
  roomType: text("room_type"),
  shareToken: text("share_token").unique(),
  status: text("status", {
    enum: ["pending", "processing", "completed", "failed"],
  }).default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});timestamp("updated_at").defaultNow().notNull(),
});

export const projects = pgTable("project", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});