import {
  $boolean,
  $enum,
  $env,
  $number,
  $optional,
  $string,
} from "./validator.ts";

Deno.test("env", async (t) => {
  await t.step("happy path", () => {
    const errors: string[] = [];

    const result = $env({
      PORT: $number,
      HOST: $string,
      NODE_ENV: $enum(["development", "production"]),
      DEBUG: $boolean,
      USERNAME: $optional($string),
      EMAIL: $optional($string),
      PASSWORD: $optional($string),
    })({
      PORT: 8080,
      HOST: "localhost",
      NODE_ENV: "development",
      DEBUG: true,
      EMAIL: "",
      PASSWORD: "password",
    }, errors);

    if (!result) {
      throw new Error(`failed to validate env: ${errors.join(", ")}`);
    }
  });

  await t.step("failed", () => {
    const errors: string[] = [];

    const result = $env({
      str: $string,
      num: $number,
      bool: $boolean,
      enum: $enum(["a", "b", "c"]),
    })({
      str: 1,
      num: "1",
      bool: "",
      enum: "d",
    }, errors);

    if (result) {
      throw new Error("should be failed");
    }

    if (errors.length !== 4) {
      throw new Error("should be 4 errors");
    }
  });
});
