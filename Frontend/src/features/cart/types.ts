import type { ApiResponse } from '@/features/catalog/types';
import type { TemplateListItem } from '@/features/catalog/types';

export type { ApiResponse };

export type HostingPlan = {
  id: string;
  name: string;
  durationMonths: number;
  price: number;
  description?: string;
  features: string[];
  recommended: boolean;
};

export type OrderItemLine = {
  id: string;
  templateId: string;
  hostingPlanId: string;
  templatePrice: number;
  hostingPrice: number;
  template: {
    id: string;
    name: string;
    slug: string;
    price: number;
    thumbnailUrl?: string | null;
  };
  hostingPlan: HostingPlan;
};

export type Order = {
  id: string;
  orderCode: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItemLine[];
};

export type CreateOrderItem = {
  templateId: string;
  hostingPlanId: string;
};

export type EnrichedCartLine = {
  templateId: string;
  template: TemplateListItem | null;
};
