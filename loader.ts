import {
  isKV,
  parse,
} from "https://raw.githubusercontent.com/ppdx999/deno-env-parser/main/mod.ts";
import { Validator } from "./validator.ts";

export const loader = <T>(
  envText: string,
  v: Validator<T>,
): [T, null] | [null, string[]] => {
  const obj = Object.fromEntries(parse(envText).filter(isKV));
  const errors: string[] = [];

  if (v(obj, errors)) {
    return [obj, null];
  } else {
    return [null, errors];
  }
};
