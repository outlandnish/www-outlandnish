export const groupBy = <T extends Record<any, any>>(
  arr: T[],
  keyFunction: (item: T) => any
): Record<any, T[]> => {
  return arr.reduce((accumulator, val) => {
    const groupedKey = keyFunction(val)
    if (!accumulator[groupedKey]) {
      accumulator[groupedKey] = [];
    }
    accumulator[groupedKey].push(val);
    return accumulator;
  }, {} as Record<any, T[]>);
}