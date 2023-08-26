// deno-lint-ignore-file no-explicit-any

export type Validator<Expect> = (
  input: any,
  errors?: string[],
) => input is Expect;

export type Infer<T> = T extends Validator<infer E> ? E
  : unknown;

export const $undefined: Validator<undefined> = (
  input: any,
): input is undefined => {
  return input === undefined;
};

export const $string: Validator<string> = (input: any): input is string => {
  return typeof input === "string";
};

export const $number: Validator<number> = (input: any): input is number => {
  return typeof input === "number";
};

export const $boolean: Validator<boolean> = (
  input: any,
): input is boolean => {
  return typeof input === "boolean";
};

export const $optional =
  <T>(validator: Validator<T>): Validator<NonNullable<T> | null> =>
  (input: any): input is NonNullable<T> | null => {
    return input === null || input === undefined || validator(input);
  };

export const $enum =
  <const E extends readonly string[]>(enums: E): Validator<E[number]> =>
  (input: any): input is E[number] => {
    return enums.includes(input);
  };

export const $env = <
  Map extends Record<string, Validator<any>>,
>(vmap: Map) =>
(
  input: any,
  errors: string[] = [],
): input is {
  [K in keyof Map]: Infer<Map[K]>;
} => {
  if (typeof input !== "object" || input === null) {
    return false;
  }
  let success = true;
  for (const [key, validator] of Object.entries(vmap)) {
    if (key === "__proto__") {
      continue;
    }
    if (!validator(input?.[key])) {
      success = false;
      errors.push(key);
    }
  }
  return success;
};
