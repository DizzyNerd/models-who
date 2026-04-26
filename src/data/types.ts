export type ModelRow = {
  key: string;
  providerId: string;
  providerName: string;
  providerNpm?: string;
  providerApi?: string;
  providerDoc?: string;
  providerEnv: string[];
  modelId: string;
  modelName: string;
  family?: string;
  attachment: boolean;
  reasoning: boolean;
  toolCall: boolean;
  structuredOutput?: boolean;
  temperature?: boolean;
  openWeights: boolean;
  inputModalities: string[];
  outputModalities: string[];
  inputCost?: number;
  outputCost?: number;
  reasoningCost?: number;
  cacheReadCost?: number;
  cacheWriteCost?: number;
  audioInputCost?: number;
  audioOutputCost?: number;
  contextLimit?: number;
  inputLimit?: number;
  outputLimit?: number;
  knowledge?: string;
  releaseDate?: string;
  lastUpdated?: string;
  status?: string;
};

export type SnapshotMeta = {
  source: string;
  fetchedAt: string;
  providerCount: number;
  modelCount: number;
  providers: Array<{ id: string; name: string; count: number }>;
  modalities: string[];
};

export type FilterState = {
  providerId: string;
  modality: string;
  toolCall: boolean;
  reasoning: boolean;
  openWeights: boolean;
  structuredOutput: boolean;
};
