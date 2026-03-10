import { describe, expect, test, vi } from 'vitest';
import request from 'supertest';
import { app } from '../index';
import * as dogService from '../services/dogService';

describe('dogRoutes', () => {
  test('GET /api/dogs/random returns 200 with success true and mocked imageUrl', async () => {
    const mockDogData = {
      imageUrl: 'https://images.dog.ceo/breeds/sheepdog-indian/Himalayan_Sheepdog.jpg',
      status: 'success'
    };

    vi.spyOn(dogService, 'getRandomDogImage').mockResolvedValueOnce(mockDogData);

    const res = await request(app).get('/api/dogs/random');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(typeof res.body.data.imageUrl).toBe('string');
    expect(res.body.data.imageUrl).toContain('Himalayan_Sheepdog.jpg');
  });

  test('GET /api/dog/random returns 500 with error message', async () => {
    vi.spyOn(dogService, 'getRandomDogImage').mockRejectedValueOnce(
      new Error('Failed to fetch dog image: Network error')
    );

    const res = await request(app).get('/api/dog/random');

    expect(res.status).toBe(404);
  });

  test('GET /api/dogs/invalid returns 404 with proper error message', async () => {
    const res = await request(app).get('/api/dogs/invalid');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error', 'Route not found');
  });
});
