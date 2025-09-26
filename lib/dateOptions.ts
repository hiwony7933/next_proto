export type OptionItem = {
  label: string;
  value: string | number;
  disabled?: boolean;
};

export function getYearOptions(params?: {
  startYear?: number;
  endYear?: number;
  order?: "asc" | "desc";
}): OptionItem[] {
  const now = new Date();
  const end = params?.endYear ?? now.getFullYear();
  const start = params?.startYear ?? end - 5;
  const order = params?.order ?? "desc";
  const years: OptionItem[] = [];
  for (let y = start; y <= end; y++) {
    years.push({ label: `${y}년`, value: y });
  }
  return order === "desc" ? years.reverse() : years;
}

export function getMonthOptions(params: {
  year: number;
  disableFuture?: boolean;
}): OptionItem[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const result: OptionItem[] = [];
  for (let m = 1; m <= 12; m++) {
    const disabled = Boolean(
      params.disableFuture && params.year === currentYear && m > currentMonth
    );
    result.push({ label: `${m}월`, value: m, disabled });
  }
  return result;
}
