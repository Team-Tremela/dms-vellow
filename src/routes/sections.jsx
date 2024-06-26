import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

import AuthGuard from './AuthGuard';


export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const MotorPage = lazy(() => import('src/pages/motor'));
export const InventoryPage = lazy(() => import('src/pages/inventory'));
export const DealerPage = lazy(() => import('src/pages/dealer'));
export const ReportPage = lazy(() => import('src/pages/reports'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout>
            <Suspense>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </AuthGuard>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: '/dashboard/motor', element: <MotorPage /> },
        { path: '/dashboard/inventory', element: <InventoryPage /> },
        { path: '/dashboard/dealer', element: <DealerPage /> },
        { path: '/dashboard/reports', element: <ReportPage /> },
        { path: '/dashboard/products', element: <ProductsPage /> },
        { path: '/dashboard/blog', element: <BlogPage /> },
      ],
    },
    {
      path: '/',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
