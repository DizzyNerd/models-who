import { Badge } from "@/components/ui/badge";

type CapabilityBadgeProps = {
  value?: boolean;
  label: string;
};

export function CapabilityBadge({ value, label }: CapabilityBadgeProps) {
  return (
    <Badge variant={value ? "default" : "secondary"} className="rounded-full">
      {label}
    </Badge>
  );
}
