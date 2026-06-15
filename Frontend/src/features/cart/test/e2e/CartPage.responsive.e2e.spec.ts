import { test, expect } from '@playwright/test';
import { mockCommerceApis } from './fixtures/commerce-api-mocks';
import { seedCart } from './fixtures/cart-seed';
import { flexDirection, hasHorizontalOverflow, isMobileProject } from '../../../../test/e2e/layout';

test.describe('CartPage — responsive E2E', () => {
  test.beforeEach(async ({ page }) => {
    await mockCommerceApis(page);
    await page.goto('/');
    await seedCart(page);
  });

  test('không overflow ngang', async ({ page }) => {
    await page.goto('/cart');
    await expect(page.getByRole('heading', { name: 'Giỏ hàng' })).toBeVisible();
    await expect(page.getByText('Peony Dream')).toBeVisible();
    expect(await hasHorizontalOverflow(page)).toBe(false);
  });

  test('CTA checkout xếp dọc trên mobile', async ({ page }, testInfo) => {
    test.skip(!isMobileProject(testInfo.project.name), 'chỉ kiểm layout mobile 320px');

    await page.goto('/cart');
    const checkoutLink = page.getByRole('link', { name: 'Thanh toán' });
    const footer = checkoutLink.locator('xpath=..');
    expect(await flexDirection(footer)).toBe('column');
  });
});
