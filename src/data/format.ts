export function formatMoney(value?: number) {
  if (value === undefined) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 1 ? 4 : 2,
  }).format(value);
}

export function formatNumber(value?: number) {
  if (value === undefined) return "-";
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatBoolean(value?: boolean) {
  if (value === undefined) return "-";
  return value ? "Yes" : "No";
}

export function formatList(value: string[]) {
  return value.length ? value.join(", ") : "-";
}
