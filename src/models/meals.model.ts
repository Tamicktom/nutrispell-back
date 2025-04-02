//* Libraries imports
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-typebox';
import { t, Static } from 'elysia';
import { eq } from 'drizzle-orm';
import { generateText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import z from "zod";

//* Local imports
import { table } from "@/database/schema";
import { db } from '@/database';

const _createMealsSchema = createInsertSchema(table.mealsTable);
const _updateMealsSchema = createUpdateSchema(table.mealsTable);
const _selectMealsSchema = createSelectSchema(table.mealsTable);

const mealSchema = z.object({
  name: z.string().describe("Name of the meal"),
  description: z.string().describe("Description of the meal when. Use when theres extra information needed"),
  kalories: z.number().describe("Kalories of the meal in klcal, don't need to be exact"),
  weight: z.number().describe("Weight of the meal in grams, don't need to be exact"),
});

type Meal = z.infer<typeof mealSchema>;

export class MealsModel {

  public static showMealsSchema = t.Object({
    id: t.Number(),
  });
  public static storeMealsSchema = t.Omit(_createMealsSchema, ['id']);
  public static updateMealsSchema = t.Omit(_updateMealsSchema, ['user_id']);
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

  static async predictMeals(image_url: string): Promise<Meal[]> {
    const mealImage = Bun.file(`.${image_url}`, { type: "image/jpeg" });
    // convert file to base64
    const base64Image = await mealImage.arrayBuffer();

    const meals: Meal[] = [];

    await generateText({
      model: openai("gpt-4o"),
      temperature: 0.2,
      toolChoice: "required",
      messages: [
        {
          role: "system",
          content: `You are an AI that deduces the content of a plate of food from an image.
          You will receive an image of a plate of food and you will use the tool to fill the form about the food that the user will eat.
          Be generic and do not use specific names like "cup noodles", "coca-cola" or "m&m's", instead use "instant noodles", "soda" or "chocolate".
          You can add as many meals as you want.
          If theres no food in the image, do nothing.`
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Esta é a imagem do que eu vou comer" },
            {
              type: "image",
              // convert image to base64
              image: base64Image,
            }
          ]
        }
      ],
      tools: {
        fillForm: tool({
          description: "Fill the form about the food that the user will eat.",
          parameters: z.object({
            meals: z.array(mealSchema),
          }),
          execute: async (args) => {
            meals.push(...args.meals);
            return "ok";
          }
        }),
      }
    });

    return meals;
  }

  static async store(meal: Static<typeof MealsModel.storeMealsSchema>) {
    const newMeal = await db
      .insert(table.mealsTable)
      .values(meal)
      .returning()
      .get();

    return newMeal;
  };

  static async update(id: number, meal: Static<typeof MealsModel.updateMealsSchema>) {
    const updatedMeal = await db
      .update(table.mealsTable)
      .set(meal)
      .where(eq(table.mealsTable.id, id))
      .returning({
        id: table.mealsTable.id
      });

    if (!updatedMeal) {
      throw new Error('Meal not found');
    }

    return updatedMeal;
  }

  static async destroy(id: number) {
    const deletedMeal = await db
      .delete(table.mealsTable)
      .where(eq(table.mealsTable.id, id))
      .returning({
        id: table.mealsTable.id
      })
      .get();

    if (!deletedMeal) {
      throw new Error('Meal not found');
    }

    return deletedMeal;
  }
}
