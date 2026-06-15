import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { ORDER_CODE, TEMPLATE_IDS } from './cart-seed';

export const FLOW_ORDER_CODE = 'LC-20260614-DEMO';

const HOSTING_PLAN = {
  id: '90000000-0000-4000-8000-000000000006',
  name: 'Gói 6 tháng',
  durationMonths: 6,
  price: 99000,
  recommended: true,
  features: [],
};

const PEONY = {
  id: TEMPLATE_IDS[0],
  name: 'Peony Dream',
  slug: 'peony-dream',
  description: 'Thiệp cưới hồng peony lãng mạn.',
  eventType: 'wedding',
  colorTags: ['pink'],
  price: 99000,
  previewUrl: '/card-previews/peony-dream.html',
  thumbnailUrl: '/thumb.svg',
  hasMusic: true,
  featured: true,
  trending: true,
  viewCount: 2400,
  purchaseCount: 180,
  createdAt: '2026-01-01T00:00:00Z',
};

const ROSE = {
  ...PEONY,
  id: TEMPLATE_IDS[1],
  name: 'Rose Garden',
  slug: 'rose-garden',
  description: 'Thiệp hoa hồng cổ điển.',
  previewUrl: '/card-previews/rose-garden.html',
  featured: false,
};

const TEMPLATE_DETAIL = {
  ...PEONY,
  status: 'active',
  assetsPath: 'public/templates/peony-dream',
  metadata: {},
  fields: [
    {
      id: 'f1',
      fieldKey: 'bride_name',
      fieldLabel: 'Tên cô dâu',
      fieldType: 'text',
      required: true,
      displayOrder: 1,
      validation: {},
    },
  ],
  updatedAt: '2026-01-01T00:00:00Z',
};

/** Mock đủ API cho luồng catalog → giỏ → checkout → đơn hàng. */
export async function mockCheckoutFlowApis(page: Page) {
  await page.route('**/api/v1/templates?*', async (route) => {
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          content: [PEONY, ROSE],
          totalElements: 2,
          totalPages: 1,
          currentPage: 0,
          size: 12,
          hasNext: false,
          hasPrevious: false,
        },
      }),
    });
  });

  await page.route('**/api/v1/templates/peony-dream', async (route) => {
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: TEMPLATE_DETAIL }),
    });
  });

  await page.route('**/api/v1/templates/id/*', async (route) => {
    const id = decodeURIComponent(route.request().url().split('/templates/id/')[1]?.split('?')[0] ?? '');
    const item = id === PEONY.id ? PEONY : id === ROSE.id ? ROSE : null;
    if (!item) {
      await route.fulfill({ status: 404, body: JSON.stringify({ code: 'NOT_FOUND' }) });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: item }),
    });
  });

  await page.route('**/api/v1/hosting-plans', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: [HOSTING_PLAN] }),
    });
  });

  await page.route('**/api/v1/orders', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: '00000000-0000-4000-8000-000000000099',
            orderCode: FLOW_ORDER_CODE,
            status: 'created',
            totalAmount: 198000,
            createdAt: '2026-06-14T10:00:00Z',
            items: [
              {
                id: '1',
                templateId: PEONY.id,
                hostingPlanId: HOSTING_PLAN.id,
                templatePrice: 99000,
                hostingPrice: 99000,
                template: {
                  id: PEONY.id,
                  name: PEONY.name,
                  slug: PEONY.slug,
                  price: PEONY.price,
                  thumbnailUrl: PEONY.thumbnailUrl,
                },
                hostingPlan: HOSTING_PLAN,
              },
            ],
          },
        }),
      });
      return;
    }
    await route.continue();
  });

  await page.route(`**/api/v1/orders/${FLOW_ORDER_CODE}`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          id: '00000000-0000-4000-8000-000000000099',
          orderCode: FLOW_ORDER_CODE,
          status: 'created',
          totalAmount: 198000,
          createdAt: '2026-06-14T10:00:00Z',
          items: [
            {
              id: '1',
              templateId: PEONY.id,
              hostingPlanId: HOSTING_PLAN.id,
              templatePrice: 99000,
              hostingPrice: 99000,
              template: { id: PEONY.id, name: PEONY.name, slug: PEONY.slug, price: 99000 },
              hostingPlan: HOSTING_PLAN,
            },
          ],
        },
      }),
    });
  });

  // Giữ tương thích spec responsive cũ
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
          items: [],
        },
      }),
    });
  });
}

/** Đi tới danh mục — mobile mở menu trước. */
export async function openCatalogFromHeader(page: Page) {
  const width = page.viewportSize()?.width ?? 1280;
  if (width < 1024) {
    await page.getByRole('button', { name: 'Mở menu' }).click();
    await page.getByRole('dialog', { name: 'Menu điều hướng' }).getByRole('link', { name: 'Mẫu thiệp' }).click();
  } else {
    await page.getByRole('navigation', { name: 'Chính' }).getByRole('link', { name: 'Mẫu thiệp' }).click();
  }
  await expect(page).toHaveURL(/\/mau-thiep(\?|$)/);
}
