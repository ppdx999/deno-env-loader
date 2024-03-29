// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: "env-files-loader",
    version: Deno.args[0],
    description: "Type safe env files loader written in deno",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/ppdx999/deno-env-loader.git",
    },
    bugs: {
      url: "https://github.com/ppdx999/deno-env-loader/issues",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
