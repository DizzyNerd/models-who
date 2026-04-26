import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type ColumnResizeMode,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ArrowDown, ArrowUp, ChevronsUpDown, Copy } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatBoolean, formatList, formatMoney, formatNumber } from "../data/format";
import type { ModelRow } from "../data/types";

type ModelsTableProps = {
  models: ModelRow[];
  selectedKey?: string;
  onSelect: (model: ModelRow) => void;
};

function copyText(value: string) {
  void navigator.clipboard?.writeText(value);
}

function SortIcon({ direction }: { direction: false | "asc" | "desc" }) {
  if (direction === "asc") return <ArrowUp data-icon="inline-end" />;
  if (direction === "desc") return <ArrowDown data-icon="inline-end" />;
  return <ChevronsUpDown data-icon="inline-end" className="opacity-40" />;
}

export function ModelsTable({ models, selectedKey, onSelect }: ModelsTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");

  const columns = useMemo<ColumnDef<ModelRow>[]>(
    () => [
      {
        accessorKey: "providerName",
        header: "Provider",
        size: 150,
        minSize: 80,
        maxSize: 300,
        cell: ({ row }) => (
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <span className="flex size-5 shrink-0 items-center justify-center rounded bg-primary text-[10px] font-semibold text-primary-foreground">
              {row.original.providerName.slice(0, 1)}
            </span>
            <span className="truncate">{row.original.providerName}</span>
          </span>
        ),
      },
      {
        accessorKey: "modelName",
        header: "Model",
        size: 200,
        minSize: 100,
        maxSize: 400,
        cell: ({ row }) => (
          <strong className="truncate">{row.original.modelName}</strong>
        ),
      },
      {
        accessorKey: "family",
        header: "Family",
        size: 100,
        minSize: 60,
        maxSize: 200,
        cell: (info) => (
          <span className="truncate">{(info.getValue() as string) || "-"}</span>
        ),
      },
      {
        accessorKey: "modelId",
        header: "Model ID",
        size: 240,
        minSize: 120,
        maxSize: 500,
        cell: ({ row }) => (
          <span className="inline-flex min-w-0 items-center gap-1">
            <code className="truncate text-xs text-muted-foreground">
              {row.original.modelId}
            </code>
            <Button
              variant="ghost"
              size="icon-xs"
              className="shrink-0"
              onClick={(event) => {
                event.stopPropagation();
                copyText(row.original.modelId);
              }}
              aria-label={`Copy ${row.original.modelId}`}
            >
              <Copy />
            </Button>
          </span>
        ),
      },
      {
        accessorFn: (row) => row.inputModalities.join(", "),
        id: "inputModalities",
        header: "Input",
        size: 80,
        minSize: 50,
        maxSize: 200,
        cell: ({ row }) => (
          <span className="truncate">{formatList(row.original.inputModalities)}</span>
        ),
      },
      {
        accessorFn: (row) => row.outputModalities.join(", "),
        id: "outputModalities",
        header: "Output",
        size: 80,
        minSize: 50,
        maxSize: 200,
        cell: ({ row }) => (
          <span className="truncate">{formatList(row.original.outputModalities)}</span>
        ),
      },
      {
        accessorKey: "inputCost",
        header: "In $",
        size: 80,
        minSize: 50,
        maxSize: 150,
        cell: ({ row }) => formatMoney(row.original.inputCost),
        sortingFn: "basic",
      },
      {
        accessorKey: "outputCost",
        header: "Out $",
        size: 80,
        minSize: 50,
        maxSize: 150,
        cell: ({ row }) => formatMoney(row.original.outputCost),
        sortingFn: "basic",
      },
      {
        accessorKey: "contextLimit",
        header: "Context",
        size: 80,
        minSize: 50,
        maxSize: 150,
        cell: ({ row }) => formatNumber(row.original.contextLimit),
        sortingFn: "basic",
      },
      {
        accessorKey: "outputLimit",
        header: "Out limit",
        size: 80,
        minSize: 50,
        maxSize: 150,
        cell: ({ row }) => formatNumber(row.original.outputLimit),
        sortingFn: "basic",
      },
      {
        accessorKey: "toolCall",
        header: "Tools",
        size: 64,
        minSize: 44,
        maxSize: 100,
        enableResizing: false,
        cell: ({ row }) => formatBoolean(row.original.toolCall),
      },
      {
        accessorKey: "reasoning",
        header: "Reason",
        size: 64,
        minSize: 44,
        maxSize: 100,
        enableResizing: false,
        cell: ({ row }) => formatBoolean(row.original.reasoning),
      },
      {
        accessorKey: "structuredOutput",
        header: "Struct",
        size: 64,
        minSize: 44,
        maxSize: 100,
        enableResizing: false,
        cell: ({ row }) => formatBoolean(row.original.structuredOutput),
      },
      {
        accessorKey: "openWeights",
        header: "Weights",
        size: 64,
        minSize: 44,
        maxSize: 100,
        enableResizing: false,
        cell: ({ row }) => (row.original.openWeights ? "Open" : "Closed"),
      },
      {
        accessorKey: "releaseDate",
        header: "Release",
        size: 88,
        minSize: 60,
        maxSize: 150,
        cell: (info) => (info.getValue() as string) || "-",
      },
      {
        accessorKey: "lastUpdated",
        header: "Updated",
        size: 88,
        minSize: 60,
        maxSize: 150,
        cell: (info) => (info.getValue() as string) || "-",
      },
    ],
    [],
  );

  const table = useReactTable({
    data: models,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode,
    defaultColumn: {
      minSize: 50,
      maxSize: 600,
    },
  });

  const { columnSizing, columnSizingInfo } = table.getState();

  const columnSizeVars = useMemo(() => {
    const vars: Record<string, number> = {};
    for (const header of table.getFlatHeaders()) {
      vars[`--header-${header.id}-size`] = header.getSize();
      vars[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return vars;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnSizing, columnSizingInfo, table]);

  const rows = table.getRowModel().rows;
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 12,
    measureElement: useCallback(
      (el: Element) => el.getBoundingClientRect().height,
      [],
    ),
  });

  const totalSize = table.getTotalSize();

  return (
    <Card className="min-h-0 min-w-0 overflow-hidden p-0">
      <div
        className="h-full min-h-0 overflow-auto"
        ref={parentRef}
        style={{ ...columnSizeVars } as React.CSSProperties}
      >
        <div
          className="sticky top-0 z-20 border-b bg-muted"
          style={{ width: totalSize }}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <div key={headerGroup.id} className="flex h-10">
              {headerGroup.headers.map((header) => (
                <div
                  key={header.id}
                  className="relative flex h-10 shrink-0"
                  style={{
                    width: `calc(var(--header-${header.id}-size) * 1px)`,
                  }}
                >
                  <button
                    type="button"
                    className="flex h-10 min-w-0 flex-1 cursor-pointer items-center justify-between gap-1 px-2 text-left text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted-foreground/10"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <span className="truncate">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </span>
                    <SortIcon direction={header.column.getIsSorted()} />
                  </button>
                  {header.column.getCanResize() && (
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      onDoubleClick={() => header.column.resetSize()}
                      className={cn(
                        "absolute -right-px top-0 z-10 h-full w-1.5 cursor-col-resize select-none touch-none",
                        header.column.getIsResizing()
                          ? "bg-primary"
                          : "bg-transparent hover:bg-border",
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div
          className="relative"
          style={{
            height: rowVirtualizer.getTotalSize(),
            width: totalSize,
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            const isSelected = row.original.key === selectedKey;
            return (
              <div
                key={row.id}
                ref={rowVirtualizer.measureElement}
                data-index={virtualRow.index}
                role="row"
                className={cn(
                  "absolute inset-x-0 top-0 flex cursor-pointer border-b transition-colors hover:bg-muted/60",
                  isSelected ? "bg-muted" : "bg-background",
                )}
                style={{ transform: `translateY(${virtualRow.start}px)` }}
                onClick={() => onSelect(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <div
                    key={cell.id}
                    className="flex min-w-0 shrink-0 items-center overflow-hidden text-ellipsis px-2 py-2 text-sm"
                    style={{
                      width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
