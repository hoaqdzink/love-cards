import type { Page } from '@playwright/test';
import { ORDER_CODE, TEMPLATE_IDS } from './cart-seed';

const HOSTING_PLAN = {
  id: '90000000-0000-4000-8000-000000000006',
  name: 'Gói 6 tháng',
  durationMonths: 6,
  price: 99000,
  recommended: true,
  features: [],
};

function templatePayload(id: string, name: string, slug: string) {
  return {
    success: true,
    data: {
      id,
      name,
      slug,
      price: 99000,
      thumbnailUrl: '/thumb.svg',
      eventType: 'wedding',
      colors: ['pink'],
    },
  };
}

const TEMPLATES: Record<string, { name: string; slug: string }> = {
  [TEMPLATE_IDS[0]]: { name: 'Peony Dream', slug: 'peony-dream' },
  [TEMPLATE_IDS[1]]: { name: 'Rose Garden', slug: 'rose-garden' },
};

/** Mock Order/Catalog API cho E2E cart — không cần backend Java. */
export async function mockCommerceApis(page: Page) {
  await page.route('**/api/v1/hosting-plans', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: [HOSTING_PLAN] }),
    });
  });

  await page.route('**/api/v1/templates/id/*', async (route) => {
    const url = route.request().url();
    const id = decodeURIComponent(url.split('/templates/id/')[1]?.split('?')[0] ?? '');
    const meta = TEMPLATES[id];
    if (!meta) {
      await route.fulfill({
        status: 404,
        body: JSON.stringify({ code: 'NOT_FOUND', message: 'Template not found' }),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(templatePayload(id, meta.name, meta.slug)),
    });
  });

  await page.route(`**/api/v1/orders/${ORDER_CODE}`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          id: '00000000-0000-4000-8000-000000000001',
          orderCode: ORDER_CODE,
          status: 'created',
          totalAmount: 198000,
          createdAt: '2026-06-12T10:00:00Z',
          items: [
            {
              id: '1',
              templateId: TEMPLATE_IDS[0],
              hostingPlanId: HOSTING_PLAN.id,
              templatePrice: 99000,
              hostingPrice: 99000,
              template: {
                id: TEMPLATE_IDS[0],
                name: 'Peony Dream',
                slug: 'peony-dream',
                price: 99000,
                thumbnailUrl: '/thumb.svg',
              },
              hostingPlan: HOSTING_PLAN,
            },
          ],
        },
      }),
    });
  });
}
