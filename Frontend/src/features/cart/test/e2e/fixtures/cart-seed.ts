import type { Page } from '@playwright/test';

export const TEMPLATE_IDS = [
  '11111111-1111-4111-8111-111111111111',
  '22222222-2222-4222-8222-222222222222',
] as const;

export const ORDER_CODE = 'LC-20260612-WPNP';

/** Zustand persist key — khớp useCartStore `{ name: 'lc_cart' }`. */
export async function seedCart(page: Page, templateIds: readonly string[] = TEMPLATE_IDS) {
  await page.evaluate((items) => {
    localStorage.setItem(
      'lc_cart',
      JSON.stringify({ state: { items: [...items] }, version: 0 }),
    );
    localStorage.setItem('lc_language', 'vi');
  }, templateIds);
}
