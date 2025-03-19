//* Libraries imports
import { Elysia } from "elysia";

//* Local imports
import { MealsModel } from "@/models/meals.model";

const apiRoutes = new Elysia();

apiRoutes
  .post("/meals",
    async (props) => {
      const newMeal = await MealsModel.createMeal(props.body);
      return newMeal;
    },
    {
      body: MealsModel.createMealsSchema
    }
  );

export { apiRoutes };