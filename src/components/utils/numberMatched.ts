export default async function numberMatched(
  offset: number,
  limit: number,
  count: number
): Promise<number> {
  let numberMatched: number = 0;
  const startIndex = Math.min(offset, count);
  const endIndex = Math.min(startIndex + limit, count);
  numberMatched += endIndex - startIndex;
  return numberMatched;
}
