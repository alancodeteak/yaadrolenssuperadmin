import { Building2, Users, Clock, TrendingUp, Eye, Edit, Trash2, Mail, Phone, MapPin, DollarSign } from 'lucide-react'

export default function EntityCard({ 
  entity, 
  type = 'company', // 'company', 'department'
  onView, 
  onEdit, 
  onDelete,
  additionalInfo = []
}) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount))
  }

  // Determine entity type and properties
  const isShop = entity.shop_code !== undefined
  const isDepartment = type === 'department'
  
  // Status logic
  const getStatus = () => {
    if (isDepartment) {
      return {
        text: entity.is_active ? 'Active' : 'Inactive',
        className: entity.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }
    }
    
    if (isShop) {
      return {
        text: entity.is_active ? 'Active' : 'Inactive',
        className: entity.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }
    }
    
    return {
      text: entity.status || 'Unknown',
      className: entity.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
    }
  }

  // Icon and color logic
  const getIconConfig = () => {
    if (isDepartment) {
      return {
        icon: Building2,
        bgColor: 'bg-purple-100',
        iconColor: 'text-purple-600'
      }
    }
    
    return {
      icon: Building2,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    }
  }

  const status = getStatus()
  const iconConfig = getIconConfig()
  const IconComponent = iconConfig.icon

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${iconConfig.bgColor} rounded-lg flex items-center justify-center`}>
            <IconComponent className={`w-5 h-5 ${iconConfig.iconColor}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{entity.name}</h3>
            <p className="text-sm text-gray-500">
              {isDepartment ? `ID: ${entity.id}` : 
               isShop ? entity.shop_code : 
               (entity.industry || 'Company')}
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${status.className}`}>
          {status.text}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-4">
        {/* Description */}
        {entity.description && (
          <div className="flex items-start space-x-2">
            <div className="w-4 h-4 mt-0.5 text-gray-400">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{entity.description}</p>
          </div>
        )}

        {/* Contact Information */}
        {(entity.email || entity.phone || entity.address) && (
          <div className="space-y-2">
            {entity.email && (
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{entity.email}</span>
              </div>
            )}
            {entity.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{entity.phone}</span>
              </div>
            )}
            {entity.address && (
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 line-clamp-1">{entity.address}</span>
              </div>
            )}
          </div>
        )}

        {/* Department specific info */}
        {isDepartment && entity.budget && (
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Budget: {formatCurrency(entity.budget)}</span>
          </div>
        )}

        {/* Shop specific info */}
        {isShop && (
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            {entity.max_employees && (
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>Max: {entity.max_employees}</span>
              </div>
            )}
            {entity.max_payroll_budget && (
              <div className="flex items-center space-x-1">
                <DollarSign className="w-4 h-4" />
                <span>{formatCurrency(entity.max_payroll_budget)}</span>
              </div>
            )}
          </div>
        )}

        {/* Additional info from props */}
        {additionalInfo.map((info, index) => (
          <div key={index} className="flex items-center space-x-2">
            {info.icon && <info.icon className="w-4 h-4 text-gray-400" />}
            <span className="text-sm text-gray-600">{info.text}</span>
          </div>
        ))}

        {/* Timestamps */}
        <div className="flex items-center space-x-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
          {entity.created_at && (
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Created: {formatDate(entity.created_at)}</span>
            </div>
          )}
          {entity.updated_at && (
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>Updated: {formatDate(entity.updated_at)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button
          onClick={() => onView(entity)}
          className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span className="text-sm">View</span>
        </button>
        <button
          onClick={() => onEdit(entity)}
          className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Edit className="w-4 h-4" />
          <span className="text-sm">Edit</span>
        </button>
        <button
          onClick={() => onDelete(entity)}
          className="flex-1 flex items-center justify-center space-x-2 bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span className="text-sm">Delete</span>
        </button>
      </div>
    </div>
  )
}
