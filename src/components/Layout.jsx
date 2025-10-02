import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppDispatch } from '../store/hooks'
import { logout } from '../store/slices/authSlice'
import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout({ children }) {
  const dispatch = useAppDispatch()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const location = useLocation()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} currentPath={location.pathname} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onMenuToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} onLogout={handleLogout} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
