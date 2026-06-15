import { test, expect } from '@playwright/test';
import { mockCommerceApis } from './fixtures/commerce-api-mocks';
import { ORDER_CODE } from './fixtures/cart-seed';
import { flexDirection, hasHorizontalOverflow, isMobileProject } from '../../../../test/e2e/layout';

test.describe('OrderDetailPage — responsive E2E', () => {
  test.beforeEach(async ({ page }) => {
    await mockCommerceApis(page);
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('lc_language', 'vi'));
  });

  test('không overflow ngang', async ({ page }) => {
    await page.goto(`/orders/${ORDER_CODE}`);
    await expect(page.getByRole('heading', { name: ORDER_CODE })).toBeVisible();
    expect(await hasHorizontalOverflow(page)).toBe(false);
  });

  test('footer links xếp dọc trên mobile', async ({ page }, testInfo) => {
    test.skip(!isMobileProject(testInfo.project.name), 'chỉ kiểm layout mobile 320px');

    await page.goto(`/orders/${ORDER_CODE}`);
    const continueLink = page.getByRole('link', { name: 'Tiếp tục xem mẫu' });
    const actions = continueLink.locator('xpath=..');
    expect(await flexDirection(actions)).toBe('column');
  });

  test('mã đơn dài không tràn layout', async ({ page }, testInfo) => {
    test.skip(!isMobileProject(testInfo.project.name), 'chỉ kiểm layout mobile 320px');

    await page.goto(`/orders/${ORDER_CODE}`);
    const heading = page.getByRole('heading', { name: ORDER_CODE });
    await expect(heading).toBeVisible();
    await expect(heading).toHaveClass(/break-all/);
    expect(await hasHorizontalOverflow(page)).toBe(false);
  });
});
