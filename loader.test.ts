import { loader } from "./loader.ts";
import {
  $boolean,
  $enum,
  $env,
  $number,
  $optional,
  $string,
} from "./validator.ts";

const throwErr = (msg: string): never => {
  throw new Error(msg);
};

Deno.test("loader", async (t) => {
  await t.step("happy path", () => {
    const [env, errors] = loader(
      `
      PORT=8080
      HOST=localhost
      NODE_ENV=development
      DEBUG=true
      PASSWORD=password
    `,
      $env({
        PORT: $number,
        HOST: $string,
        NODE_ENV: $enum(["development", "production"]),
        DEBUG: $boolean,
        USERNAME: $optional($string),
        EMAIL: $optional($string),
        PASSWORD: $optional($string),
      }),
    );

    if (errors !== null) {
      throw new Error(`failed to validate env: ${errors.join(", ")}`);
    }

    env.PORT === 8080 || throwErr("PORT should be 8080");
    env.HOST === "localhost" || throwErr("HOST should be localhost");
    env.NODE_ENV === "development" ||
      throwErr("NODE_ENV should be development");
    env.DEBUG === true || throwErr("DEBUG should be true");
  });

  await t.step("failed", () => {
    const [env, errors] = loader(
      `
      str=1
      num="1"
      bool=""
      enum=d
    `,
      $env({
        str: $string,
        num: $number,
        bool: $boolean,
        enum: $enum(["a", "b", "c"]),
      }),
    );

    if (env !== null) {
      throw new Error("should be failed");
    }

    if (errors?.length !== 4) {
      throw new Error("should be 4 errors");
    }
  });
});
