import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { CatalogPage } from '@/features/catalog/pages/CatalogPage';
import { TemplatePreviewPage } from '@/features/catalog/pages/TemplatePreviewPage';
import { CartPage, CheckoutPage, OrderDetailPage } from '@/features/cart/pages';

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/mau-thiep', element: <CatalogPage /> },
  { path: '/mau-thiep/:slug', element: <TemplatePreviewPage /> },
  { path: '/cart', element: <CartPage /> },
  { path: '/checkout', element: <CheckoutPage /> },
  { path: '/orders/:orderCode', element: <OrderDetailPage /> },
  // Phase 5: Auth
  // { path: '/dang-nhap', element: <LoginPage /> },
  // { path: '/dang-ky', element: <RegisterPage /> },
]);
