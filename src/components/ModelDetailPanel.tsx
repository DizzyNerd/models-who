import { Copy, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatBoolean, formatList, formatMoney, formatNumber } from "../data/format";
import type { ModelRow } from "../data/types";
import { CapabilityBadge } from "./CapabilityBadge";

type ModelDetailPanelProps = {
  model?: ModelRow;
  onClose: () => void;
};

function copyText(value: string) {
  void navigator.clipboard?.writeText(value);
}

function DetailItem({ label, value }: { label: string; value?: string | number | boolean }) {
  return (
    <div className="min-w-0 rounded-lg border bg-muted/30 p-2">
      <span className="mb-1 block text-xs text-muted-foreground">{label}</span>
      <strong className="block [overflow-wrap:anywhere] text-sm font-medium">
        {value === undefined || value === "" ? "-" : String(value)}
      </strong>
    </div>
  );
}

export function ModelDetailPanel({ model, onClose }: ModelDetailPanelProps) {
  if (!model) {
    return (
      <Card className="min-h-0 overflow-auto">
        <CardContent className="text-sm text-muted-foreground">
          Select a model to inspect pricing, limits, provider metadata, and capabilities.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="min-h-0 overflow-auto">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
            {model.providerName}
          </span>
          <CardTitle className="text-xl">{model.modelName}</CardTitle>
        </div>
        <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close detail panel">
          <X data-icon />
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-2 rounded-lg border bg-muted/40 p-2">
          <code className="truncate text-xs text-muted-foreground">
            {model.providerId}/{model.modelId}
          </code>
          <Button variant="ghost" size="icon-xs" onClick={() => copyText(model.modelId)}>
            <Copy data-icon />
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <CapabilityBadge value={model.toolCall} label="Tools" />
          <CapabilityBadge value={model.reasoning} label="Reasoning" />
          <CapabilityBadge value={model.structuredOutput} label="Structured" />
          <CapabilityBadge value={model.openWeights} label="Open weights" />
        </div>

        <Separator />

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
            Pricing per 1M tokens
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <DetailItem label="Input" value={formatMoney(model.inputCost)} />
            <DetailItem label="Output" value={formatMoney(model.outputCost)} />
            <DetailItem label="Reasoning" value={formatMoney(model.reasoningCost)} />
            <DetailItem label="Cache read" value={formatMoney(model.cacheReadCost)} />
            <DetailItem label="Cache write" value={formatMoney(model.cacheWriteCost)} />
            <DetailItem label="Audio input" value={formatMoney(model.audioInputCost)} />
            <DetailItem label="Audio output" value={formatMoney(model.audioOutputCost)} />
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Limits</h3>
          <div className="grid grid-cols-2 gap-2">
            <DetailItem label="Context" value={formatNumber(model.contextLimit)} />
            <DetailItem label="Input" value={formatNumber(model.inputLimit)} />
            <DetailItem label="Output" value={formatNumber(model.outputLimit)} />
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Metadata</h3>
          <div className="grid grid-cols-2 gap-2">
            <DetailItem label="Family" value={model.family} />
            <DetailItem label="Input" value={formatList(model.inputModalities)} />
            <DetailItem label="Output" value={formatList(model.outputModalities)} />
            <DetailItem label="Temperature" value={formatBoolean(model.temperature)} />
            <DetailItem label="Attachment" value={formatBoolean(model.attachment)} />
            <DetailItem label="Knowledge" value={model.knowledge} />
            <DetailItem label="Release" value={model.releaseDate} />
            <DetailItem label="Updated" value={model.lastUpdated} />
            <DetailItem label="Status" value={model.status} />
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Provider</h3>
          <div className="grid grid-cols-2 gap-2">
            <DetailItem label="Provider ID" value={model.providerId} />
            <DetailItem label="Package" value={model.providerNpm} />
            <DetailItem label="API" value={model.providerApi} />
            <DetailItem label="Env" value={model.providerEnv.join(", ")} />
          </div>
          {model.providerDoc ? (
            <Button asChild variant="link" className="mt-2 h-auto px-0">
              <a href={model.providerDoc} target="_blank" rel="noreferrer">
                Provider docs
                <ExternalLink data-icon="inline-end" />
              </a>
            </Button>
          ) : null}
        </section>
      </CardContent>
    </Card>
  );
}
