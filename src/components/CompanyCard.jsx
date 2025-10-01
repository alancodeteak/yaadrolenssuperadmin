import { Building2, Users, Clock, TrendingUp, Eye, Edit } from 'lucide-react'

export default function CompanyCard({ company, onView, onEdit }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Company Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
            <p className="text-sm text-gray-500">{company.industry}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          company.status === 'active' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {company.status}
        </div>
      </div>

      {/* Company Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-gray-500 mb-1">
            <Users className="w-4 h-4" />
            <span className="text-xs">Employees</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">{company.employeeCount}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-gray-500 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-xs">Today</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">{company.attendanceToday}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-gray-500 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">Rate</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">{company.attendanceRate}%</p>
        </div>
      </div>

      {/* Company Details */}
      <div className="text-sm text-gray-600 mb-4">
        <p><span className="font-medium">Location:</span> {company.location}</p>
        <p><span className="font-medium">Last Activity:</span> {company.lastActivity}</p>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button
          onClick={() => onView(company)}
          className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span className="text-sm">View</span>
        </button>
        <button
          onClick={() => onEdit(company)}
          className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Edit className="w-4 h-4" />
          <span className="text-sm">Edit</span>
        </button>
      </div>
    </div>
  )
}

