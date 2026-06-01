import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { CatalogPage } from '@/features/catalog/pages/CatalogPage';
import { TemplatePreviewPage } from '@/features/catalog/pages/TemplatePreviewPage';

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/mau-thiep', element: <CatalogPage /> },
  { path: '/mau-thiep/:slug', element: <TemplatePreviewPage /> },
  // Phase 2: Cart & Checkout
  // { path: '/gio-hang', element: <CartPage /> },
  // { path: '/thanh-toan', element: <CheckoutPage /> },
  // Phase 5: Auth
  // { path: '/dang-nhap', element: <LoginPage /> },
  // { path: '/dang-ky', element: <RegisterPage /> },
]);
