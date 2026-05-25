/**
 * Performs a GET request to the given URL and parses the JSON response.
 *
 * @param url - The URL to fetch.
 * @param signal - An optional AbortSignal to cancel the request.
 * @returns A promise that resolves with the parsed JSON response.
 * @throws {Error} When the response status is not OK.
 */
export async function httpGet<T>(
  url: string,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
