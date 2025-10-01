import { 
  Home, 
  Building2, 
  Users, 
  Clock, 
  BarChart3, 
  Settings, 
  FileText 
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Sidebar({ isOpen, currentPath }) {
  const navigate = useNavigate()
  
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, path: '/' },
    { id: 'companies', name: 'Companies', icon: Building2, path: '/companies' },
    { id: 'employees', name: 'Employees', icon: Users, path: '/employees' },
    { id: 'attendance', name: 'Attendance', icon: Clock, path: '/attendance' },
    { id: 'reports', name: 'Reports', icon: BarChart3, path: '/reports' },
    { id: 'documents', name: 'Documents', icon: FileText, path: '/documents' },
    { id: 'settings', name: 'Settings', icon: Settings, path: '/settings' },
  ]

  return (
    <div className={`bg-blue-50 transition-all duration-300 ${isOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
      <div className="flex flex-col h-screen">
        {/* Brand Section */}
        <div className="p-6 border-b border-blue-100">
          <div className="flex items-center space-x-3">
            <img 
              src="/assets/Yadro-logo.png" 
              alt="Yaadro Logo" 
              className="w-8 h-8 object-contain"
            />
            <h2 className="text-lg font-bold text-blue-500">yaadrolens</h2>
          </div>
          <p className="text-xs text-blue-400 mt-1">Admin Panel</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    currentPath === item.path
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-blue-100 hover:text-blue-700'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-blue-100">
          <div className="flex items-center space-x-2 text-xs text-blue-400">
            <span>Powered by</span>
            <img 
              src="/assets/codeteak-logo.png" 
              alt="CodeTeak Logo" 
              className="h-3 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
