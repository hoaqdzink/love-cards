import { RouterProvider } from 'react-router-dom';
import { QueryProvider } from '@/app/providers/QueryProvider';
import '@/app/providers/I18nProvider';
import { router } from '@/app/router';

export default function App() {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  );
}