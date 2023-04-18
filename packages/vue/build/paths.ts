import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// D:\ww\w2-ui-icons\packages\vue\build
const basePath = dirname(fileURLToPath(import.meta.url));

// D:\ww\w2-ui-icons\packages\vue
export const pathRoot = resolve(basePath, "..");
// D:\ww\w2-ui-icons\packages\vue\src
export const pathSrc = resolve(pathRoot, "src");
// D:\ww\w2-ui-icons\packages\vue\src\components
export const pathComponents = resolve(pathSrc, "components");
// D:\ww\w2-ui-icons\packages\vue\dist
export const pathOutput = resolve(pathRoot, "dist");
