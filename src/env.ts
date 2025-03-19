//* Libraries imports
import { t } from "elysia";
import { Value } from "@sinclair/typebox/value";

const envSchema = t.Object({
  DATABASE_URL: t.String(),
})

const env = Value.Parse(envSchema, process.env);

export { env };