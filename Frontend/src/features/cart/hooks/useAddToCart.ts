/**
 * Thêm mẫu vào giỏ (Zustand + localStorage) và hiển thị toast phản hồi.
 * Dùng từ catalog preview, TemplateCard, trending.
 */
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '@/app/store/useCartStore';
import { useUIStore } from '@/app/store/useUIStore';

export function useAddToCart() {
  const { t } = useTranslation();
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useUIStore((state) => state.addToast);

  return useCallback(
    (templateId: string) => {
      const result = addItem(templateId);

      if (result === 'duplicate') {
        addToast(t('cart.duplicate'), 'info');
        return;
      }
      if (result === 'max') {
        // Giới hạn 20 mẫu — enforce cả client (store) lẫn server
        addToast(t('cart.maxItems'), 'info');
        return;
      }
      addToast(t('cart.added'), 'success');
    },
    [addItem, addToast, t],
  );
}
