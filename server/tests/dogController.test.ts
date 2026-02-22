import { describe, expect, test, vi } from 'vitest';
import { getDogImage } from '../controllers/dogController';
import * as dogService from '../services/dogService';

const createMockResponse = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnThis();
  res.json = vi.fn();
  return res;
};

describe('dogController - getDogImage', () => {
  test('Return dog image with success true and mocked service data', async () => {
    const mockDogData = {
      imageUrl: 'https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg',
      status: 'success'
    };

    vi.spyOn(dogService, 'getRandomDogImage').mockResolvedValueOnce(mockDogData);

    const req: any = {};
    const res = createMockResponse();

    await getDogImage(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockDogData
    });
  });
});
