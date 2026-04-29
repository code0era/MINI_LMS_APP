// src/utils/retry.ts
/**
 * Retries an async function up to `attempts` times with exponential backoff.
 * Usage: await retry(() => api.get('/courses'), 3, 500)
 */
export async function retry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  delayMs = 500
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (attempts <= 1) throw err;
    await new Promise((r) => setTimeout(r, delayMs));
    return retry(fn, attempts - 1, delayMs * 2);
  }
}
