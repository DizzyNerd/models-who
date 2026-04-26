import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { modelsApiSource, normalizeModels, type UpstreamProvider } from "../src/data/normalize";

async function main() {
  const response = await fetch(modelsApiSource);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${modelsApiSource}: ${response.status} ${response.statusText}`);
  }

  const upstream = (await response.json()) as Record<string, UpstreamProvider>;
  const { models, meta } = normalizeModels(upstream);

  const outDir = path.join(process.cwd(), "public", "data");
  await mkdir(outDir, { recursive: true });
  await Promise.all([
    writeFile(path.join(outDir, "models.snapshot.json"), `${JSON.stringify(models)}\n`),
    writeFile(path.join(outDir, "models.meta.json"), `${JSON.stringify(meta, null, 2)}\n`),
  ]);

  console.log(`Fetched ${models.length} models from ${meta.providerCount} providers`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
