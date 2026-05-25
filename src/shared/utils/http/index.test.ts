import { afterEach, describe, expect, it, vi } from 'vitest';
import { httpGet } from './index';

const mockFetch = (body: unknown, ok = true, status = 200): void => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok,
      status,
      statusText: ok ? 'OK' : 'Not Found',
      json: () => Promise.resolve(body),
    }),
  );
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('httpGet - success', () => {
  it('returns parsed JSON on a successful response', async () => {
    mockFetch({ id: 1, name: 'test' });
    const result = await httpGet<{ id: number; name: string }>(
      'https://example.com',
    );
    expect(result).toEqual({ id: 1, name: 'test' });
  });

  it('passes the URL to fetch', async () => {
    mockFetch({});
    const fetchSpy = vi.mocked(fetch);
    await httpGet('https://example.com/api');
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://example.com/api',
      expect.any(Object),
    );
  });

  it('passes the AbortSignal to fetch when provided', async () => {
    mockFetch({});
    const fetchSpy = vi.mocked(fetch);
    const controller = new AbortController();
    await httpGet('https://example.com', controller.signal);
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://example.com',
      expect.objectContaining({ signal: controller.signal }),
    );
  });

  it('resolves with an array response', async () => {
    mockFetch([1, 2, 3]);
    const result = await httpGet<number[]>('https://example.com');
    expect(result).toEqual([1, 2, 3]);
  });
});

describe('httpGet - failure', () => {
  it('throws when the response status is not ok (404)', async () => {
    mockFetch({ message: 'not found' }, false, 404);
    await expect(httpGet('https://example.com')).rejects.toThrow('HTTP 404');
  });

  it('throws when the response status is not ok (500)', async () => {
    mockFetch({ message: 'server error' }, false, 500);
    await expect(httpGet('https://example.com')).rejects.toThrow('HTTP 500');
  });

  it('rejects when fetch itself throws (e.g. network error)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('Network Error')),
    );
    await expect(httpGet('https://example.com')).rejects.toThrow(
      'Network Error',
    );
  });

  it('rejects when the request is aborted', async () => {
    const controller = new AbortController();
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockRejectedValue(
          new DOMException('The operation was aborted.', 'AbortError'),
        ),
    );
    controller.abort();
    await expect(
      httpGet('https://example.com', controller.signal),
    ).rejects.toThrow('The operation was aborted.');
  });
});
