import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { getRandomDogImage } from '../services/dogService';

describe('dogService - getRandomDogImage', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('Return dog image with imageUrl matching mocked message and status as success', async () => {
    const mockMessage = 'https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg';
    const mockStatus = 'success';
    const mockApiResponse = {
      message: mockMessage,
      status: mockStatus
    };

    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce(mockApiResponse)
    } as any);

    const result = await getRandomDogImage();

    expect(result.imageUrl).toBe(mockMessage);
    expect(result.status).toBe('success');
    expect(mockFetch).toHaveBeenCalledOnce();
  });

  test('Reject when API returns error status', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    } as any);

    await expect(getRandomDogImage()).rejects.toThrow('Failed to fetch dog image: Dog API returned status 500');
    expect(mockFetch).toHaveBeenCalledOnce();
  });
});
