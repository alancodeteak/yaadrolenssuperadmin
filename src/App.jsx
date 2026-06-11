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
    <Router>
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
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
