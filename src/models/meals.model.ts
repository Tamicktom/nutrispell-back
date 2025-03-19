//* Libraries imports
import { createInsertSchema } from 'drizzle-typebox';
import { t, Static } from 'elysia';

//* Local imports
import { table } from "@/database/schema";
import { db } from '@/database';

const _createMealsSchema = createInsertSchema(table.mealsTable);

export class MealsModel {

  public static createMealsSchema = t.Omit(_createMealsSchema, ['id']);

  static async createMeal(meal: Static<typeof MealsModel.createMealsSchema>) {
    const newMeal = await db
      .insert(table.mealsTable)
      .values(meal)
      .returning({
        id: table.mealsTable.id
      });

    return newMeal;
  }
}
