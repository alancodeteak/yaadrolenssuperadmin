import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Companies from './pages/Companies'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // For demo purposes, auto-login for testing dashboard
  useEffect(() => {
    // Auto-login for demo - remove this in production
    localStorage.setItem('auth_token', 'demo-token')
    setIsAuthenticated(true)
    
    // Production auth check:
    // const token = localStorage.getItem('auth_token')
    // setIsAuthenticated(!!token)
  }, [])

  const handleLogin = (credentials) => {
    // In a real app, you would make an API call here
    // For demo purposes, we'll just set a mock token
    localStorage.setItem('auth_token', 'demo-token')
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    setIsAuthenticated(false)
  }

  return (
    <Router>
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Layout onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/companies" element={<Companies />} />
            {/* Add more routes as needed */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      )}
    </Router>
  )
}

export default App;





