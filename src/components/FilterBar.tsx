import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FilterState, SnapshotMeta } from "../data/types";

type FilterBarProps = {
  filters: FilterState;
  meta: SnapshotMeta;
  onChange: (filters: FilterState) => void;
};

const emptyFilters: FilterState = {
  providerId: "",
  modality: "",
  toolCall: false,
  reasoning: false,
  openWeights: false,
  structuredOutput: false,
};

export function FilterBar({ filters, meta, onChange }: FilterBarProps) {
  const update = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={filters.providerId || "all"}
        onValueChange={(value) => update("providerId", value === "all" ? "" : value)}
      >
        <SelectTrigger className="w-[220px]" aria-label="Provider">
          <SelectValue placeholder="All providers" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All providers</SelectItem>
            {meta.providers.map((provider) => (
              <SelectItem key={provider.id} value={provider.id}>
                {provider.name} ({provider.count})
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        value={filters.modality || "all"}
        onValueChange={(value) => update("modality", value === "all" ? "" : value)}
      >
        <SelectTrigger className="w-[180px]" aria-label="Modality">
          <SelectValue placeholder="All modalities" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All modalities</SelectItem>
            {meta.modalities.map((modality) => (
              <SelectItem key={modality} value={modality}>
                {modality}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <label className="inline-flex h-8 items-center gap-2 rounded-lg border bg-muted/50 px-2.5 text-sm">
        <Checkbox
          checked={filters.toolCall}
          onCheckedChange={(checked) => update("toolCall", checked === true)}
        />
        Tools
      </label>
      <label className="inline-flex h-8 items-center gap-2 rounded-lg border bg-muted/50 px-2.5 text-sm">
        <Checkbox
          checked={filters.reasoning}
          onCheckedChange={(checked) => update("reasoning", checked === true)}
        />
        Reasoning
      </label>
      <label className="inline-flex h-8 items-center gap-2 rounded-lg border bg-muted/50 px-2.5 text-sm">
        <Checkbox
          checked={filters.structuredOutput}
          onCheckedChange={(checked) => update("structuredOutput", checked === true)}
        />
        Structured
      </label>
      <label className="inline-flex h-8 items-center gap-2 rounded-lg border bg-muted/50 px-2.5 text-sm">
        <Checkbox
          checked={filters.openWeights}
          onCheckedChange={(checked) => update("openWeights", checked === true)}
        />
        Open weights
      </label>
      <Button
        type="button"
        variant="outline"
        onClick={() => onChange(emptyFilters)}
      >
        <RotateCcw data-icon="inline-start" />
        Reset
      </Button>
    </div>
  );
}
