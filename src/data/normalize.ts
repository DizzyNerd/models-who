import type { ModelRow, SnapshotMeta } from "./types";

export type UpstreamProvider = {
  id: string;
  name: string;
  npm?: string;
  api?: string;
  doc?: string;
  env?: string[];
  models?: Record<string, UpstreamModel>;
};

export type UpstreamModel = {
  id: string;
  name: string;
  family?: string;
  attachment?: boolean;
  reasoning?: boolean;
  tool_call?: boolean;
  structured_output?: boolean;
  temperature?: boolean;
  open_weights?: boolean;
  modalities?: {
    input?: string[];
    output?: string[];
  };
  cost?: {
    input?: number;
    output?: number;
    reasoning?: number;
    cache_read?: number;
    cache_write?: number;
    input_audio?: number;
    output_audio?: number;
  };
  limit?: {
    context?: number;
    input?: number;
    output?: number;
  };
  knowledge?: string;
  release_date?: string;
  last_updated?: string;
  status?: string;
};

export const modelsApiSource = "https://models.dev/api.json";

export function normalizeModels(
  upstream: Record<string, UpstreamProvider>,
  fetchedAt = new Date().toISOString(),
) {
  const providers = Object.values(upstream);
  if (!providers.length) {
    throw new Error("Snapshot contains no providers");
  }

  const models = providers.flatMap((provider) =>
    Object.values(provider.models ?? {}).map((model) => ({
      key: `${provider.id}/${model.id}`,
      providerId: provider.id,
      providerName: provider.name,
      providerNpm: provider.npm,
      providerApi: provider.api,
      providerDoc: provider.doc,
      providerEnv: provider.env ?? [],
      modelId: model.id,
      modelName: model.name,
      family: model.family,
      attachment: Boolean(model.attachment),
      reasoning: Boolean(model.reasoning),
      toolCall: Boolean(model.tool_call),
      structuredOutput: model.structured_output,
      temperature: model.temperature,
      openWeights: Boolean(model.open_weights),
      inputModalities: model.modalities?.input ?? [],
      outputModalities: model.modalities?.output ?? [],
      inputCost: model.cost?.input,
      outputCost: model.cost?.output,
      reasoningCost: model.cost?.reasoning,
      cacheReadCost: model.cost?.cache_read,
      cacheWriteCost: model.cost?.cache_write,
      audioInputCost: model.cost?.input_audio,
      audioOutputCost: model.cost?.output_audio,
      contextLimit: model.limit?.context,
      inputLimit: model.limit?.input,
      outputLimit: model.limit?.output,
      knowledge: model.knowledge,
      releaseDate: model.release_date,
      lastUpdated: model.last_updated,
      status: model.status,
    })),
  ) satisfies ModelRow[];

  if (!models.length) {
    throw new Error("Snapshot contains no models");
  }

  models.sort((a, b) => {
    const provider = a.providerName.localeCompare(b.providerName);
    return provider || a.modelName.localeCompare(b.modelName);
  });

  const providerCounts = new Map<string, { id: string; name: string; count: number }>();
  const modalitySet = new Set<string>();
  for (const row of models) {
    const provider = providerCounts.get(row.providerId) ?? {
      id: row.providerId,
      name: row.providerName,
      count: 0,
    };
    provider.count += 1;
    providerCounts.set(row.providerId, provider);
    row.inputModalities.forEach((modality) => modalitySet.add(modality));
    row.outputModalities.forEach((modality) => modalitySet.add(modality));
  }

  const meta: SnapshotMeta = {
    source: modelsApiSource,
    fetchedAt,
    providerCount: providers.length,
    modelCount: models.length,
    providers: Array.from(providerCounts.values()).sort((a, b) => a.name.localeCompare(b.name)),
    modalities: Array.from(modalitySet).sort(),
  };

  return { models, meta };
}
