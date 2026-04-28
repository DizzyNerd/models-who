import Fuse from "fuse.js";
import { RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FilterBar } from "./components/FilterBar";
import { ModelDetailPanel } from "./components/ModelDetailPanel";
import { ModelsTable } from "./components/ModelsTable";
import { SearchBar } from "./components/SearchBar";
import { loadSnapshot } from "./data/loadSnapshot";
import { modelsApiSource, normalizeModels, type UpstreamProvider } from "./data/normalize";
import type { FilterState, ModelRow, SnapshotMeta } from "./data/types";

const emptyFilters: FilterState = {
  providerId: "",
  modality: "",
  toolCall: false,
  reasoning: false,
  openWeights: false,
  structuredOutput: false,
};

export function App() {
  const [models, setModels] = useState<ModelRow[]>([]);
  const [meta, setMeta] = useState<SnapshotMeta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [selected, setSelected] = useState<ModelRow | undefined>();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  useEffect(() => {
    loadSnapshot()
      .then((snapshot) => {
        setModels(snapshot.models);
        setMeta(snapshot.meta);
        setSelected(snapshot.models[0]);
      })
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : "Could not load snapshot");
      });
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(models, {
        keys: [
          "providerName",
          "providerId",
          "modelName",
          "modelId",
          "family",
          "inputModalities",
          "outputModalities",
          "status",
        ],
        threshold: 0.28,
        ignoreLocation: true,
      }),
    [models],
  );

  const filteredModels = useMemo(() => {
    const searched = query.trim()
      ? fuse.search(query.trim()).map((result) => result.item)
      : models;

    return searched.filter((model) => {
      if (filters.providerId && model.providerId !== filters.providerId) return false;
      if (
        filters.modality &&
        !model.inputModalities.includes(filters.modality) &&
        !model.outputModalities.includes(filters.modality)
      ) {
        return false;
      }
      if (filters.toolCall && !model.toolCall) return false;
      if (filters.reasoning && !model.reasoning) return false;
      if (filters.structuredOutput && !model.structuredOutput) return false;
      if (filters.openWeights && !model.openWeights) return false;
      return true;
    });
  }, [filters, fuse, models, query]);

  async function refreshLiveData() {
    setRefreshing(true);
    setRefreshError(null);
    try {
      const response = await fetch(modelsApiSource, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Refresh failed (${response.status})`);
      }
      const upstream = (await response.json()) as Record<string, UpstreamProvider>;
      const snapshot = normalizeModels(upstream);
      setModels(snapshot.models);
      setMeta(snapshot.meta);
      setSelected((current) => {
        if (!current) return snapshot.models[0];
        return snapshot.models.find((model) => model.key === current.key) ?? snapshot.models[0];
      });
    } catch (refreshErrorValue) {
      setRefreshError(
        refreshErrorValue instanceof Error ? refreshErrorValue.message : "Refresh failed",
      );
    } finally {
      setRefreshing(false);
    }
  }

  if (error) {
    return (
      <main className="grid min-h-screen place-content-center gap-3 bg-background p-6 text-center text-foreground">
        <h1 className="text-2xl font-semibold">Models, who?</h1>
        <p className="text-destructive">{error}</p>
        <p className="text-sm text-muted-foreground">
          Run <code>npm run fetch:data</code> and restart the dev server.
        </p>
      </main>
    );
  }

  if (!meta) {
    return (
      <main className="grid min-h-screen place-content-center gap-3 bg-background p-6 text-center text-foreground">
        <h1 className="text-2xl font-semibold">Models, who?</h1>
        <p className="text-sm text-muted-foreground">Loading snapshot...</p>
      </main>
    );
  }

  return (
    <main className="flex h-screen min-h-0 flex-col overflow-hidden bg-muted/30 p-4 text-foreground md:p-6">
      <header className="mb-4 grid shrink-0 gap-4 lg:grid-cols-[minmax(260px,1fr)_minmax(320px,560px)] lg:items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Models, who?</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filteredModels.length.toLocaleString()} of {meta.modelCount.toLocaleString()} models,
            {` ${meta.providerCount.toLocaleString()} providers`}. Snapshot{" "}
            {new Date(meta.fetchedAt).toLocaleString()}.
          </p>
        </div>
        <SearchBar value={query} onChange={setQuery} />
      </header>

      <Card className="mb-4 shrink-0">
        <CardContent className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Button
          type="button"
          onClick={refreshLiveData}
          disabled={refreshing}
        >
          <RefreshCw data-icon="inline-start" className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing" : "Fetch latest"}
          </Button>
          <span>Update models from models.dev</span>
          {refreshError ? <strong className="text-destructive">{refreshError}</strong> : null}
        </CardContent>
      </Card>

      <div className="mb-4 shrink-0">
        <FilterBar filters={filters} meta={meta} onChange={setFilters} />
      </div>

      <section className="grid min-h-0 flex-1 items-stretch gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <ModelsTable
          models={filteredModels}
          selectedKey={selected?.key}
          onSelect={setSelected}
        />
        <ModelDetailPanel model={selected} onClose={() => setSelected(undefined)} />
      </section>
    </main>
  );
}
