import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { store } from './store'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Companies from './pages/Companies'
import Departments from './pages/Departments'
import DepartmentDetails from './pages/DepartmentDetails'
import ShopDetails from './pages/ShopDetails'
import ShopAnalytics from './pages/ShopAnalytics'
import CreateShop from './pages/CreateShop'
import { useAppSelector, useAppDispatch } from './store/hooks'
import { checkAuth } from './store/slices/authSlice'
import authService from './services/authService'
import LoadingSpinner from './components/common/LoadingSpinner'

function AppContent() {
  const dispatch = useAppDispatch()
  const { isAuthenticated, isLoading } = useAppSelector(state => state.auth)

  useEffect(() => {
    // Check authentication status on app load
    dispatch(checkAuth())
    
    // Setup token refresh timer if authenticated
    if (authService.isAuthenticated()) {
      authService.setupTokenRefreshTimer()
    }
    
    // Cleanup on unmount
    return () => {
      authService.clearTokenRefreshTimer()
    }
  }, [dispatch])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-500">
        <div className="flex flex-col items-center">
          <img 
            src="/assets/Yadro-logo.png" 
            alt="Yaadro Logo" 
            className="w-24 h-24 object-contain mb-4" 
          />
          <LoadingSpinner 
            text="Loading..." 
            size="default"
            className="text-white"
          />
        </div>
      </div>
    )
  }

  return (
    <Router>
      {!isAuthenticated ? (
        <Login />
      ) : (
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/departments/:departmentId" element={<DepartmentDetails />} />
            <Route path="/shops/:shopId" element={<ShopDetails />} />
            <Route path="/shops/:shopId/analytics" element={<ShopAnalytics />} />
            <Route path="/shops/create" element={<CreateShop />} />
            {/* Add more routes as needed */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      )}
      <ToastContainer />
    </Router>
  )
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App;





