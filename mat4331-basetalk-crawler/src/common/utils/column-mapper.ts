export function mapValuesToObject<T>(
  values: number[],
  columnMap: Map<number, keyof T>,
): T {
  return values.reduce((acc, value, index) => {
    const key = columnMap.get(index);
    if (key) {
      acc[key] = value as T[keyof T];
    }
    return acc;
  }, {} as T);
}
