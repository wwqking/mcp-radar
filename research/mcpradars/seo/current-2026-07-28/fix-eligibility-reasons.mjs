import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const runDir = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(runDir, "page-eligibility.csv");
const current = await fs.readFile(file, "utf8");
const corrected = current
  .replaceAll(
    "lifecycle=stale (registry deletion can mean malware)",
    "lifecycle=stale (mapped from collector lifecycle=dying; temporarily noindex pending recovery)",
  )
  .replaceAll(
    "lifecycle=deprecated (registry deletion can mean malware)",
    "lifecycle=deprecated (mapped from collector lifecycle=dead; reject until a verified revival or replacement exists)",
  );
await fs.writeFile(file, corrected, "utf8");
console.log(
  JSON.stringify({
    stale_reasons_corrected: current.split(
      "lifecycle=stale (registry deletion can mean malware)",
    ).length - 1,
    deprecated_reasons_corrected: current.split(
      "lifecycle=deprecated (registry deletion can mean malware)",
    ).length - 1,
  }),
);
