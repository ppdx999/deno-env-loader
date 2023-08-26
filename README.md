# deno-env-loader
Type safe .env loader written in deno


# Usage

`.env`

```
PORT=8080
HOST=localhost
NODE_ENV=development
DEBUG=true
```

`src/env.ts`

```typescript
import {loader, $number, $string, $enum, $boolean, $env} from 'https://raw.githubusercontent.com/ppdx999/deno-env-loader/main/mod.ts'

export type Env = Infer<typeof env>;
export const [env, errors] = loader(
  Deno.readTextFileSync("./.env"),
  $env({
    PORT: $number,
    HOST: $string,
    NODE_ENV: $enum(["development", "production"]),
    DEBUG: $boolean,
  }),
);

if (errors !== null) {
  throw new Error(`failed to validate env: ${errors.join(", ")}`);
}
```
