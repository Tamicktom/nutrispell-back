//* Libraries imports
import { describe, expect, it } from 'bun:test';

//* Import app
import { app } from "@/index";

describe("should run hello world route", () => {
  it("should return 'hello world'", async () => {
    const request = new Request("http://localhost:3000/hello");

    const response = await app.handle(request).then((res) => res.text());

    expect(response).toBe("Hello world");
  });
});