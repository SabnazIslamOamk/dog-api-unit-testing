import { describe, expect, test, vi } from 'vitest';
import request from 'supertest';
import { app } from '../index';
import * as dogService from '../services/dogService';

describe('dogRoutes', () => {
  test('GET /api/dogs/random returns 200 with success true and mocked imageUrl', async () => {
    const mockDogData = {
      imageUrl: 'https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg',
      status: 'success'
    };

    vi.spyOn(dogService, 'getRandomDogImage').mockResolvedValueOnce(mockDogData);

    const res = await request(app).get('/api/dogs/random');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: mockDogData
    });
    expect(res.body.data.imageUrl).toContain('lucy.jpg');
  });

  test('GET /api/dog/random returns 500 with error message', async () => {
    vi.spyOn(dogService, 'getRandomDogImage').mockRejectedValueOnce(
      new Error('Failed to fetch dog image: Network error')
    );

    const res = await request(app).get('/api/dog/random');

    expect(res.status).toBe(404);
  });
});
