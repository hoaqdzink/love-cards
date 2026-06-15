/**
 * Helper Playwright — pause giữa các bước khi demo headed (`PW_DEMO=1`).
 */
import type { Locator, Page } from '@playwright/test';

/** Tạm dừng giữa các bước khi xem demo headed (`PW_DEMO=1`). */
export async function demoPause(page: Page, ms = 1_000) {
  if (process.env.PW_DEMO) {
    await page.waitForTimeout(ms);
  }
}

/** Scroll tới element rồi pause — dễ theo dõi thao tác trên màn hình. */
export async function focusAndPause(page: Page, locator: Locator, ms = 900) {
  await locator.scrollIntoViewIfNeeded();
  await demoPause(page, ms);
}
