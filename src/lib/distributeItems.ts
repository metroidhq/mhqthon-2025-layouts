export const distributeItems = <T>(items: T[]): T[][] => {
  const total = items.length;
  if (total === 0) return [];

  // 1. Determine the number of rows (R)
  // Pattern: 1-2 items -> 1 row; 3-6 -> 2; 7-12 -> 3; 13-20 -> 4
  // Formula: R(R+1) >= total
  let numRows = 1;
  while (numRows * (numRows + 1) < total) {
    numRows++;
  }

  // 2. Initial Row Sizes (Base Math)
  const baseSize = Math.floor(total / numRows);
  const extra = total % numRows;
  const rowSizes = new Array(numRows).fill(baseSize);

  // 3. Distribute extras top-down (first rows get the extra items)
  for (let i = 0; i < extra; i++) {
    rowSizes[i]++;
  }

  // 4. Map back to items
  const result: T[][] = [];
  let offset = 0;
  for (const size of rowSizes) {
    result.push(items.slice(offset, offset + size));
    offset += size;
  }

  return result;
};
