import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="flex h-10 items-center gap-2 rounded-lg border bg-background px-3 shadow-xs">
      <Search className="size-4 text-muted-foreground" aria-hidden="true" />
      <Input
        className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search provider, model, family, capability..."
        autoComplete="off"
      />
      {value ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          <X data-icon />
        </Button>
      ) : null}
    </label>
  );
}
