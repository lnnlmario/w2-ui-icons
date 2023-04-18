import chalk from "chalk";
import glob from "fast-glob";
import consola from "consola";
import camelcase from 'camelcase'
import { emptyDir } from "fs-extra";
import { resolve, basename } from "node:path";
import { readFile, writeFile } from "node:fs/promises";

import { pathComponents } from "./paths";

function chalkInfo(msg: string) {
  return chalk.greenBright(msg);
}

function printInfo(msg: string) {
  consola.info(chalkInfo(msg));
}

function getName(file: string) {
  const bName = basename(file, ".svg");

  return {
    filename: camelcase(bName), // addLocation
    componentName: camelcase(bName, { pascalCase: true }), // AddLocation
  }
}

function getAllSvgFiles() {
  // D:\ww\w2-ui-icons\packages\vue/node_modules/@element-plus/icons-svg
  const dir = `${process.cwd()}/node_modules/@element-plus/icons-svg`;
  return glob("*.svg", { cwd: dir, absolute: true });
}

async function transform2SFC(file: string) {
  // svg 内容
  const content = await readFile(file, "utf-8");
  const { filename, componentName } = getName(file);
  // 组件中内容
  const sfcContent = `
    <template>
    ${content}
    </template>
    <script lang="ts">
    import type { DefineComponent } from 'vue'
    export default ({
      name: "${componentName}",
    }) as DefineComponent
    </script>
  `;
  // 创建sfc组件
  writeFile(
    resolve(pathComponents, `${filename}.vue`),
    sfcContent,
    "utf-8"
  );
}

function generateEntryFile(files: string[]) {
  const entryContent = files
    .map((file) => {
      const { filename, componentName } = getName(file);
      // 等于：import { default as xxx } from './xxx'; export xxx
      return `export { default as ${componentName} } from "./${filename}.vue";`;
    })
    .join("\n");
  writeFile(resolve(pathComponents, "index.ts"), entryContent, "utf-8");
}

printInfo("generateing all svg files.");
const files = await getAllSvgFiles();

printInfo("generateing vue components directory.");
// 目录存在就清空，目录不存在就创建该目录
await emptyDir(pathComponents);

printInfo("generateing vue component.");
await Promise.all(files.map(transform2SFC));

printInfo("generateing entry file.");
generateEntryFile(files);
