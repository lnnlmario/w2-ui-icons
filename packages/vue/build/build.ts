import { build } from "esbuild";
import { resolve } from "node:path";
import { emptyDir } from "fs-extra";
import vue from "unplugin-vue/esbuild";
import type { BuildOptions, Format } from "esbuild";

import { printInfo } from "./utils";
import { pathSrc, pathOutput } from "./paths";

function getBuildOptions(format: Format) {
  const options: BuildOptions = {
    entryPoints: [resolve(pathSrc, "index.ts")],
    target: "es2018",
    platform: "neutral",
    plugins: [
      vue({
        isProduction: true,
        sourceMap: false,
      }),
    ],
    bundle: true,
    format,
    minifySyntax: true,
    outdir: pathOutput,
    external: ["vue"],
  };
  return options;
}

function buildBundle() {
  const doBuild = async (minify: boolean) => {
    await Promise.all([
      build({
        ...getBuildOptions("esm"),
        entryNames: `[name]${minify ? '.min' : ''}`,
        minify,
      }),
      build({
        ...getBuildOptions("cjs"),
        entryNames: `[name]${minify ? '.min' : ''}`,
        outExtension: { '.js': '.cjs' },
        minify,
      }),
    ]);
  };

  return Promise.all([doBuild(false), doBuild(true)]);
}

printInfo("cleaning dist.");
await emptyDir(pathOutput);

printInfo("building dist.");
await buildBundle();
