import { test, expect } from '@playwright/test';
import {
  FLOW_ORDER_CODE,
  mockCheckoutFlowApis,
  openCatalogFromHeader,
} from './fixtures/checkout-flow-mocks';
import { demoPause, focusAndPause } from '../../../../test/e2e/demo';

test.describe('Luồng khách Phase 2 @flow', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await mockCheckoutFlowApis(page);
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('lc_language', 'vi'));
    await page.evaluate(() => localStorage.removeItem('lc_cart'));
  });

  test('xem mẫu → thêm giỏ → checkout → tạo đơn CREATED', async ({ page }) => {
    await test.step('1. Trang chủ — khách vào Love Cards', async () => {
      await expect(page.getByRole('link', { name: 'LoveCards' })).toBeVisible();
      await demoPause(page, 1_200);
    });

    await test.step('2. Mở danh mục mẫu thiệp', async () => {
      await openCatalogFromHeader(page);
      await expect(page.getByRole('heading', { name: 'Khám phá mẫu thiệp' })).toBeVisible();
      const peonyCard = page.getByRole('heading', { name: 'Peony Dream' });
      await focusAndPause(page, peonyCard);
    });

    await test.step('3. Xem trước mẫu Peony Dream', async () => {
      const previewBtn = page
        .locator('article')
        .filter({ has: page.getByRole('heading', { name: 'Peony Dream' }) })
        .getByRole('link', { name: 'Xem trước' });
      await focusAndPause(page, previewBtn);
      await previewBtn.click();
      await page.waitForURL('**/mau-thiep/peony-dream');
      await expect(page.getByRole('heading', { name: 'Peony Dream', level: 1 })).toBeVisible();
      await demoPause(page, 1_200);
    });

    await test.step('4. Thêm vào giỏ hàng', async () => {
      const addBtn = page.getByRole('button', { name: 'Thêm vào giỏ' });
      await focusAndPause(page, addBtn);
      await addBtn.click();
      await expect(page.getByRole('button', { name: 'Đã thêm vào giỏ hàng' })).toBeVisible();
      await demoPause(page, 800);
    });

    await test.step('5. Mở giỏ hàng từ Header', async () => {
      const cartLink = page.getByRole('link', { name: 'Giỏ hàng' });
      await expect(cartLink.locator('span')).toHaveText('1');
      await focusAndPause(page, cartLink);
      await cartLink.click();
      await page.waitForURL('**/cart');
      await expect(page.getByRole('heading', { name: 'Giỏ hàng' })).toBeVisible();
      await expect(page.getByText('Peony Dream')).toBeVisible();
      await demoPause(page, 1_000);
    });

    await test.step('6. Sang trang thanh toán', async () => {
      const checkoutLink = page.getByRole('link', { name: 'Thanh toán' });
      await focusAndPause(page, checkoutLink);
      await checkoutLink.click();
      await page.waitForURL('**/checkout');
      await expect(page.getByRole('heading', { name: 'Thanh toán' })).toBeVisible();
      const hostingSelect = page.getByLabel('Gói hosting');
      await expect(hostingSelect).toBeVisible();
      await focusAndPause(page, hostingSelect);
      await demoPause(page, 1_000);
    });

    await test.step('7. Đặt hàng — tạo đơn CREATED', async () => {
      const placeOrder = page.getByRole('button', { name: 'Đặt hàng' });
      await focusAndPause(page, placeOrder);
      await placeOrder.click();
      await page.waitForURL(`**/orders/${FLOW_ORDER_CODE}`);
      await expect(page.getByRole('heading', { name: FLOW_ORDER_CODE })).toBeVisible();
      await expect(page.getByText('Trạng thái')).toBeVisible();
      await expect(page.getByText('created', { exact: true })).toBeVisible();
      await demoPause(page, 1_500);
    });
  });
});
