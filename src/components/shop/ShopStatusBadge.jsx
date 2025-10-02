import { CheckCircle, XCircle } from 'lucide-react'

export default function ShopStatusBadge({ isActive, className = '' }) {
  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
      isActive 
        ? 'bg-green-100 text-green-700' 
        : 'bg-red-100 text-red-700'
    } ${className}`}>
      {isActive ? (
        <CheckCircle className="w-4 h-4" />
      ) : (
        <XCircle className="w-4 h-4" />
      )}
      <span>{isActive ? 'Active' : 'Inactive'}</span>
    </div>
  )
}
