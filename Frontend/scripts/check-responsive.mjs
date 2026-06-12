/**
 * P2-51 — kiểm tra không overflow ngang tại 320 / 768 / 1280px.
 * Chạy: npm run dev (5173) rồi node scripts/check-responsive.mjs
 */
import { chromium } from 'playwright';

const BASE = process.env.FE_URL ?? 'http://localhost:5173';
const VIEWPORTS = [
  { name: 'mobile', width: 320, height: 640 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
];

const CART_STORAGE = JSON.stringify({
  state: {
    items: [
      '11111111-1111-4111-8111-111111111111',
      '22222222-2222-4222-8222-222222222222',
    ],
  },
  version: 0,
});

const PAGES = [
  { path: '/cart', needsCart: true },
  { path: '/checkout', needsCart: true },
  { path: '/orders/LC-20260612-WPNP', needsCart: false },
];

function hasHorizontalOverflow(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth > doc.clientWidth + 1;
  });
}

const browser = await chromium.launch();
let failed = 0;

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await context.newPage();

  if (PAGES.some((p) => p.needsCart)) {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.evaluate((value) => localStorage.setItem('lc_cart', value), CART_STORAGE);
  }

  for (const { path, needsCart } of PAGES) {
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 30_000 });
    await page.waitForTimeout(500);

    const overflow = await hasHorizontalOverflow(page);
    const status = overflow ? 'FAIL' : 'OK';
    console.log(`[${status}] ${vp.name} (${vp.width}px) ${path}`);

    if (overflow) {
      failed += 1;
      const diff = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      console.log(`       overflow: +${diff}px`);
    }
  }

  await context.close();
}

await browser.close();
process.exit(failed > 0 ? 1 : 0);
