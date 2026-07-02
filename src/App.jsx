import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { dashboardToastTransition } from './utils/dashboardToastTransition';
import { store } from './store';
import SuperAdminLayout from './layouts/SuperAdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Companies from './pages/Companies';
import ShopDetails from './pages/ShopDetails';
import ShopAnalytics from './pages/ShopAnalytics';
import CreateShop from './pages/CreateShop';
import Departments from './pages/Departments';
import DepartmentDetails from './pages/DepartmentDetails';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { checkAuth, refreshAccessToken } from './store/slices/authSlice';
import authService from './services/authService';
import { LoadingScreen } from './components/common/Lottie';
import { API_BASE_URL } from './services/api';

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined;

function ConfigError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-lg font-semibold text-gray-900">Configuration error</h1>
        <p className="mt-2 text-sm text-gray-600">
          <code className="rounded bg-gray-100 px-1">VITE_API_BASE_URL</code> is not set. Add it to
          your <code className="rounded bg-gray-100 px-1">.env</code> file (for example{' '}
          <code className="rounded bg-gray-100 px-1">http://localhost:8000/api/v1</code>).
        </p>
      </div>
    </div>
  );
}

function AppContent() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const initAuth = async () => {
      dispatch(checkAuth());

      if (authService.isAccessTokenExpired() && !authService.isRefreshTokenExpired()) {
        try {
          await dispatch(refreshAccessToken()).unwrap();
        } catch {
          authService.logout();
          dispatch(checkAuth());
        }
      }

      if (authService.isAuthenticated()) {
        authService.setupTokenRefreshTimer();
      }
    };

    initAuth();

    return () => {
      authService.clearTokenRefreshTimer();
    };
  }, [dispatch]);

  if (isLoading) {
    return <LoadingScreen message="Loading..." />;
  }

  return (
    <Router basename={routerBasename}>
      {!isAuthenticated ? (
        <Login />
      ) : (
        <Routes>
          <Route element={<SuperAdminLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/organizations/:orgId" element={<ShopDetails />} />
            <Route path="/organizations/:orgId/analytics" element={<ShopAnalytics />} />
            <Route path="/organizations/:orgId/departments" element={<Departments />} />
            <Route
              path="/organizations/:orgId/departments/:departmentId"
              element={<DepartmentDetails />}
            />
            <Route path="/organizations/create" element={<CreateShop />} />
            <Route path="/shops/:shopId" element={<Navigate to="/companies" replace />} />
            <Route path="/shops/:shopId/analytics" element={<Navigate to="/companies" replace />} />
            <Route path="/shops/create" element={<Navigate to="/organizations/create" replace />} />
            <Route path="/departments" element={<Navigate to="/companies" replace />} />
            <Route path="/departments/:departmentId" element={<Navigate to="/companies" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      )}
      <ToastContainer
        position="top-center"
        autoClose={false}
        hideProgressBar
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="light"
        transition={dashboardToastTransition}
        className="dashboard-toast-container"
        toastClassName="dashboard-toast-item"
        bodyClassName="dashboard-toast-body"
      />
    </Router>
  );
}

function App() {
  if (!API_BASE_URL) {
    return <ConfigError />;
  }

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
