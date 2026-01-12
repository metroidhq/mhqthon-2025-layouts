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

  // 3. Symmetric Remainder Distribution
  // Your tests (10 -> 3-4-3; 11 -> 4-3-4; 7 -> 2-3-2) show a "Center-Out"
  // or "Edges-In" logic depending on if extra is 1 or 2.
  const indices: number[] = [];
  if (numRows % 2 !== 0) {
    // For Odd Rows (e.g. 3): Priority is Middle, then Outer Edges
    const mid = Math.floor(numRows / 2);
    indices.push(mid);
    for (let i = 0; i < mid; i++) {
      indices.push(i, numRows - 1 - i);
    }
  } else {
    // For Even Rows (e.g. 2, 4): Priority is Outer Edges first
    for (let i = 0; i < numRows / 2; i++) {
      indices.push(i, numRows - 1 - i);
    }
  }

  // Assign extras based on the specific test patterns
  for (let i = 0; i < extra; i++) {
    rowSizes[indices[i]]++;
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
