import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Campaigns from '../pages/Campaigns/Campaigns';
import CreateCampaign from '../pages/Campaigns/CreateCampaign';
import Automation from '../pages/Automation/Automation';
import Inbox from '../pages/Inbox/Inbox';
import Analytics from '../pages/Analytics/Analytics';
import Templates from '../pages/Templates/Templates';
import Contacts from '../pages/Contacts/Contacts';
import Integrations from '../pages/Integrations/Integrations';
import Settings from '../pages/Settings/Settings';
import Help from '../pages/Help/Help';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import PublicRoute from '../components/auth/PublicRoute';

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    )
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    )
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'campaigns',
        element: <Campaigns />
      },
      {
        path: 'campaigns/create',
        element: <CreateCampaign />
      },
      {
        path: 'automation',
        element: <Automation />
      },
      {
        path: 'inbox',
        element: <Inbox />
      },
      {
        path: 'analytics',
        element: <Analytics />
      },
      {
        path: 'templates',
        element: <Templates />
      },
      {
        path: 'contacts',
        element: <Contacts />
      },
      {
        path: 'integrations',
        element: <Integrations />
      },
      {
        path: 'settings',
        element: <Settings />
      },
      {
        path: 'help',
        element: <Help />
      }
    ]
  }
]);

export default router;
