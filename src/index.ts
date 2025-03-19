//* Libraries imports
import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";

const app = new Elysia()

app.use(cors());
app.use(swagger());
app.use(staticPlugin());

app.get("/hello", () => "Hello world");

app.listen(3000);

console.log(`
  🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}
  Swagger is running at http://${app.server?.hostname}:${app.server?.port}/swagger
  `
);
