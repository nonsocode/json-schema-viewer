import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
// export const outDir = resolve("/mnt/c/Users/nchukwuogor/chromex", "dist");
const __filename = fileURLToPath(import.meta.url);
export const outDir = resolve(dirname(__filename), "..", "..", "dist");
