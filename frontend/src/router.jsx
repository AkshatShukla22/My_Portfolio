// frontend/src/router.jsx
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home/Home';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ProjectDetail from './pages/ProjectDetail/ProjectDetail';
import BlogDetail from './pages/BlogDetail/BlogDetail';
import ProtectedRoute from './components/common/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'projects/:id',
        element: <ProjectDetail />,
      },
      {
        path: 'blog/:slug',
        element: <BlogDetail />,
      },
      {
        path: 'admin/login',
        element: <AdminLogin />,
      },
      {
        path: 'admin/dashboard',
        element: (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);