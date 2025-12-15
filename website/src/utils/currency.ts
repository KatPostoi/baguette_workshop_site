export const formatCurrency = (value: number): string => {
  if (!Number.isFinite(value)) {
    return "—";
  }
  return `${value.toLocaleString("ru-RU")} ₽`;
};
