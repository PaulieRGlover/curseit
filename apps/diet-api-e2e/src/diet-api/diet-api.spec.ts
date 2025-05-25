import { api } from './client';

describe('GET /api/health', () => {
  it('is healthy', async () => {
    await api
      .get('/health')
      .send()
      .expect(200)
      .then(response => {
        expect(response.text).toBe('ok');
      });
  });
});
