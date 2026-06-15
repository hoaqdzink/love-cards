/**
 * Helper đo layout responsive trên browser thật (Playwright E2E).
 */
import type { Locator, Page } from '@playwright/test';

/** Kiểm tra trang có thanh cuộn ngang (P2-51). */
export async function hasHorizontalOverflow(page: Page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth > doc.clientWidth + 1;
  });
}

/** Đọc flex-direction computed — assert mobile stack layout. */
export async function flexDirection(locator: Locator) {
  return locator.evaluate((el) => getComputedStyle(el).flexDirection);
}

export function isMobileProject(projectName: string) {
  return projectName === 'mobile';
}
