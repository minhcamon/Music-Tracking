import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/main-layout';
import DashboardPage from '@/modules/dashboard/dashboard.page';
import ConnectionPage from '@/modules/connection/connection.page';
import SyncPage from '@/modules/sync/sync.page';
import HistoryPage from '@/modules/history/history.page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'connection',
        element: <ConnectionPage />,
      },
      {
        path: 'sync',
        element: <SyncPage />,
      },
      {
        path: 'history',
        element: <HistoryPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
