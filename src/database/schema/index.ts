//* Libraries imports
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  age: int().notNull(),
  email: text().notNull().unique(),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  meals: many(table.mealsTable),
}));

export const mealsTable = sqliteTable("meals_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  kalories: int().notNull(),
  image_path: text().notNull(),

  user_id: int().notNull(),
});

export const mealsRelations = relations(mealsTable, ({ one }) => ({
  user: one(table.usersTable, {
    fields: [mealsTable.user_id],
    references: [usersTable.id],
  }),
}));

export const table = {
  usersTable,
  mealsTable,
} as const;

export type Table = typeof table;