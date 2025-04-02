//* Libraries imports
import { Elysia, t } from "elysia";

//* Local imports
import { MealsModel } from "@/models";

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
        detail: {
          description: "The user can upload an image of a meal and the server will predict the meals in the image.",
        },
        response: {
          200: t.Object({
            meals: t.Array(t.Object({
              name: t.String(),
              description: t.String(),
              kalories: t.Number(),
              weight: t.Number(),
            })),
            imagePath: t.String(),
          }),
        }
      }
    )
    .get("/",
      async (props) => {
        const meals = await MealsModel.index();
        return meals;
      },
      {
        query: t.Object({
          page: t.Optional(t.Number()),
          limit: t.Optional(t.Number()),
        }),
        detail: {
          description: "Get all meals from the logged user. The user can use the query params to paginate the results.",
        },
        response: {
          200: t.Array(t.Object({
            id: t.Number(),
            name: t.String(),
            kalories: t.Number(),
          })),
        }
      }
    )
    .get("/:id",
      async (props) => {
        const meal = await MealsModel.show(props.params.id);
        return meal;
      },
      {
        params: MealsModel.showMealsSchema,
        detail: {
          description: "Get a meal by id. The user can use the query params to paginate the results.",
        },
        response: {
          200: t.Object({
            id: t.Number(),
            name: t.String(),
            kalories: t.Number(),
          }),
        }
      },
    )
    .post("/",
      async (props) => {
        const imagePath = props.body.image_path;

        // check if image exists on disk
        const imageExist = await Bun.file(`.${imagePath}`, { type: "image/jpeg" }).exists();

        if (!imageExist) {
          props.set.status = 400;
          return {
            status: 400,
            message: "image_not_found",
            error: "ImagePath not found in the server",
          };
        }

        const newMeal = await MealsModel.store(props.body);

        props.set.status = 201;
        return newMeal;
      },
      {
        body: MealsModel.storeMealsSchema,
        detail: {
          description: "The user can create a new meal.",
        },
        response: {
          201: t.Object({
            id: t.Number(),
            name: t.String(),
            kalories: t.Number(),
          }),
          400: t.Object({
            status: t.Number(),
            message: t.String(),
            error: t.String(),
          }),
        }
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