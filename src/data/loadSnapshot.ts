import type { ModelRow, SnapshotMeta } from "./types";

export async function loadSnapshot() {
  const [modelsResponse, metaResponse] = await Promise.all([
    fetch("/data/models.snapshot.json"),
    fetch("/data/models.meta.json"),
  ]);

  if (!modelsResponse.ok) {
    throw new Error(`Could not load models snapshot (${modelsResponse.status})`);
  }
  if (!metaResponse.ok) {
    throw new Error(`Could not load models metadata (${metaResponse.status})`);
  }

  const models = (await modelsResponse.json()) as ModelRow[];
  const meta = (await metaResponse.json()) as SnapshotMeta;
  return { models, meta };
}
