import { AlertCircle, X } from 'lucide-react'

export default function ErrorAlert({ 
  message, 
  onDismiss, 
  type = 'error',
  className = '' 
}) {
  const typeClasses = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }

  const iconClasses = {
    error: 'text-red-500',
    warning: 'text-amber-500',
    info: 'text-blue-500'
  }

  return (
    <div className={`rounded-lg border p-4 ${typeClasses[type]} ${className}`}>
      <div className="flex items-start space-x-3">
        <AlertCircle className={`w-5 h-5 mt-0.5 ${iconClasses[type]}`} />
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 ml-3"
          >
            <X className={`w-4 h-4 ${iconClasses[type]}`} />
          </button>
        )}
      </div>
    </div>
  )
}
