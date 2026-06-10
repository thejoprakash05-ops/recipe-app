// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GET } from '@/app/api/recipes/route.js';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

const OK_RESPONSE = {
  ok: true,
  json: async () => ({ results: [], offset: 0, number: 12, totalResults: 0 }),
};

describe('GET /api/recipes', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    vi.stubEnv('SPOONACULAR_API_KEY', 'test-key');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns 500 with an error message when API key is missing', async () => {
    vi.stubEnv('SPOONACULAR_API_KEY', '');
    const req = new Request('http://localhost/api/recipes?type=dessert');
    const res = await GET(req);
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toMatch(/SPOONACULAR_API_KEY/);
  });

  it('returns results from the Spoonacular response', async () => {
    const mockResults = [
      { id: 1, title: 'Pasta', image: 'https://img.spoonacular.com/1.jpg' },
    ];
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ results: mockResults, offset: 0, number: 12, totalResults: 1 }),
    });
    const req = new Request('http://localhost/api/recipes?type=main+course');
    const res = await GET(req);
    const body = await res.json();
    expect(body.results).toHaveLength(1);
    expect(body.results[0].title).toBe('Pasta');
  });

  // Regression: diet=vegetarian must be forwarded to Spoonacular (Veg filter)
  it('regression — passes diet=vegetarian to Spoonacular when diet param is vegetarian', async () => {
    mockFetch.mockResolvedValue(OK_RESPONSE);
    const req = new Request('http://localhost/api/recipes?type=dessert&diet=vegetarian');
    await GET(req);
    const calledUrl = mockFetch.mock.calls[0][0];
    expect(calledUrl).toContain('diet=vegetarian');
  });

  // Regression: diet=vegan must be forwarded (Vegan filter)
  it('regression — passes diet=vegan to Spoonacular when diet param is vegan', async () => {
    mockFetch.mockResolvedValue(OK_RESPONSE);
    const req = new Request('http://localhost/api/recipes?type=dessert&diet=vegan');
    await GET(req);
    expect(mockFetch.mock.calls[0][0]).toContain('diet=vegan');
  });

  it('does not send a diet param when diet is not provided', async () => {
    mockFetch.mockResolvedValue(OK_RESPONSE);
    const req = new Request('http://localhost/api/recipes?type=dessert');
    await GET(req);
    expect(mockFetch.mock.calls[0][0]).not.toContain('diet=');
  });

  it('forwards the cuisine param to Spoonacular', async () => {
    mockFetch.mockResolvedValue(OK_RESPONSE);
    const req = new Request('http://localhost/api/recipes?type=main+course&cuisine=indian');
    await GET(req);
    expect(mockFetch.mock.calls[0][0]).toContain('cuisine=indian');
  });

  it('uses min-missing-ingredients sort when ingredients are provided', async () => {
    mockFetch.mockResolvedValue(OK_RESPONSE);
    const req = new Request('http://localhost/api/recipes?type=dessert&ingredients=egg,flour');
    await GET(req);
    expect(mockFetch.mock.calls[0][0]).toContain('sort=min-missing-ingredients');
  });

  it('returns 500 and error message when Spoonacular returns an error', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 402,
      json: async () => ({ message: 'Your daily quota is exceeded' }),
    });
    const req = new Request('http://localhost/api/recipes?type=dessert');
    const res = await GET(req);
    expect(res.status).toBe(402);
    const body = await res.json();
    expect(body.error).toMatch(/quota/i);
  });
});
