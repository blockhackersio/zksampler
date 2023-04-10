export async function bench<T>(cb: () => Promise<T>): Promise<[T, number]> {
  const start = Date.now();
  const result = await cb();
  const duration = Date.now() - start;
  return [result, duration];
}
