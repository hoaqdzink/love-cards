import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  // Phase 1: Catalog
  // { path: '/danh-muc', element: <CatalogPage /> },
  // { path: '/mau-thiep/:slug', element: <TemplatePreviewPage /> },
  // Phase 2: Cart & Checkout
  // { path: '/gio-hang', element: <CartPage /> },
  // { path: '/thanh-toan', element: <CheckoutPage /> },
  // Phase 5: Auth
  // { path: '/dang-nhap', element: <LoginPage /> },
  // { path: '/dang-ky', element: <RegisterPage /> },
]);
