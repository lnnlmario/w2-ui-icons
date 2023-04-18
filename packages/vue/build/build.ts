import { build } from "esbuild";
import { resolve } from "node:path";
import { emptyDir } from "fs-extra";
import vue from "unplugin-vue/esbuild";

import { printInfo } from "./utils";
import { pathSrc, pathOutput } from "./paths";

function buildBundle() {
  return build({
    entryPoints: [resolve(pathSrc, "index.ts")],
    target: 'es2018', 
    platform: 'neutral',
    plugins: [
      vue({
        isProduction: true,
        sourceMap: false,
      }),
    ],
    bundle: true,
    outdir: pathOutput,
    external: ["vue"]
  });
}

printInfo("cleaning dist.");
await emptyDir(pathOutput);

printInfo("building dist.");
await buildBundle();
