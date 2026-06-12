export const MOCK_USER_ID =
  import.meta.env.VITE_MOCK_USER_ID ?? '10000000-0000-4000-8000-000000000001';

export function getMockUserHeaders(): HeadersInit {
  return { 'X-User-Id': MOCK_USER_ID };
}
