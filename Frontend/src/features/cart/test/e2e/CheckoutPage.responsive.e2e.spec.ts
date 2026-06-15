import { test, expect } from '@playwright/test';
import { mockCommerceApis } from './fixtures/commerce-api-mocks';
import { seedCart } from './fixtures/cart-seed';
import { flexDirection, hasHorizontalOverflow, isMobileProject } from '../../../../test/e2e/layout';

test.describe('CheckoutPage — responsive E2E', () => {
  test.beforeEach(async ({ page }) => {
    await mockCommerceApis(page);
    await page.goto('/');
    await seedCart(page);
  });

  test('không overflow ngang', async ({ page }) => {
    await page.goto('/checkout');
    await expect(page.getByRole('heading', { name: 'Thanh toán' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Đặt hàng' })).toBeVisible();
    expect(await hasHorizontalOverflow(page)).toBe(false);
  });

  test('nút đặt hàng xếp dọc trên mobile', async ({ page }, testInfo) => {
    test.skip(!isMobileProject(testInfo.project.name), 'chỉ kiểm layout mobile 320px');

    await page.goto('/checkout');
    const placeOrder = page.getByRole('button', { name: 'Đặt hàng' });
    const actions = placeOrder.locator('xpath=..');
    expect(await flexDirection(actions)).toBe('column');
  });
});
