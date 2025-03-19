//* Libraries imports
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-typebox';
import { t, Static } from 'elysia';
import { eq } from 'drizzle-orm';

//* Local imports
import { table } from "@/database/schema";
import { db } from '@/database';

const _createMealsSchema = createInsertSchema(table.mealsTable);
const _updateMealsSchema = createUpdateSchema(table.mealsTable);
const _selectMealsSchema = createSelectSchema(table.mealsTable);

export class MealsModel {

  public static showMealsSchema = t.Object({
    id: t.Number(),
  });
  public static storeMealsSchema = t.Omit(_createMealsSchema, ['id']);
  public static updateMealsSchema = _updateMealsSchema;
  public static selectMealsSchema = _selectMealsSchema;

  static async index() {
    const meals = await db
      .select({
        id: table.mealsTable.id,
        name: table.mealsTable.name,
        kalories: table.mealsTable.kalories,
      })
      .from(table.mealsTable)
      .limit(10);

    return meals;
  };

  static async show(id: number) {
    const meal = db
      .select({
        id: table.mealsTable.id,
        name: table.mealsTable.name,
        kalories: table.mealsTable.kalories,
      })
      .from(table.mealsTable)
      .where(eq(table.mealsTable.id, id))
      .get();

    if (!meal) {
      throw new Error('Meal not found');
    }

    return meal;
  }

  static async store(meal: Static<typeof MealsModel.storeMealsSchema>) {
    const newMeal = await db
      .insert(table.mealsTable)
      .values(meal)
      .returning({
        id: table.mealsTable.id
      });

    return newMeal;
  };
}
