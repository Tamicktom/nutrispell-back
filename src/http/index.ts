//* Libraries imports
import { Elysia, t } from "elysia";

//* Local imports
import { MealsModel } from "@/models/meals.model";

const apiRoutes = new Elysia();

apiRoutes.group("/meals", (app) => {
  return app
    .post("/predict",
      async (props) => {
        const randomImageUUID = crypto.randomUUID();
        const imagePath = `/public/1/${randomImageUUID}.jpg`;

        //save image on disk
        Bun.write(`.${imagePath}`, props.body.image);

        const meals = await MealsModel.predictMeals(imagePath);

        return {
          meals,
          imagePath
        };
      },
      {
        body: t.Object({
          image: t.File({ format: "image/jpeg" })
        }),
      }
    )
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
        const imagePath = props.body.image_path;

        // check if image exists on disk
        const imageExist = await Bun.file(`.${imagePath}`, { type: "image/jpeg" }).exists();

        if (!imageExist) {
          throw new Error("Image not found");
        }

        const newMeal = await MealsModel.store(props.body);

        return newMeal;
      },
      {
        body: MealsModel.storeMealsSchema,
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