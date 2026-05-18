import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';

// Cấu hình router cho ứng dụng:
// - Sử dụng createBrowserRouter để tạo router dùng cho SPA.
// - Trang HomePage được gán cho path '/'.
// - RouterProvider sẽ nhận router này để xử lý định tuyến.

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default function App() {
  return <AppRouter />;
}