//* Libraries imports
import { Elysia, t } from "elysia";

//* Local imports
import { MealsModel } from "@/models/meals.model";

const apiRoutes = new Elysia();

apiRoutes.group("/meals", (app) => {
  return app
    .get("/",
      async (props) => {
        const meals = await MealsModel.index();
        return meals;
      },
    )
    .get("/:id",
      async (props) => {
        const meal = await MealsModel.show(props.params.id);
        return meal;
      },
      {
        params: MealsModel.showMealsSchema
      }
    )
    .post("/",
      async (props) => {
        const newMeal = await MealsModel
          .store(
            {
              name: props.body.meal_name,
              kalories: props.body.meal_kalories,
              user_id: props.body.user_id,
            },
            props.body.image
          );
        return newMeal;
      },
      {
        // body: MealsModel.storeMealsSchema
        body: t.Object({
          meal_name: MealsModel.storeMealsSchema.properties.name,
          meal_kalories: t.Integer(),
          user_id: t.Integer(),
          image: t.File({ format: "image/jpeg" })
        }),
      }
    )
    .put("/:id",
      async (props) => {
        const updatedMeal = await MealsModel.update(props.params.id, props.body);
        return updatedMeal;
      },
      {
        params: MealsModel.showMealsSchema,
        body: MealsModel.updateMealsSchema
      }
    )
    .delete("/:id",
      async (props) => {
        await MealsModel.destroy(props.params.id);
        return "Meal deleted";
      },
      {
        params: MealsModel.showMealsSchema
      }
    );
});

export { apiRoutes };