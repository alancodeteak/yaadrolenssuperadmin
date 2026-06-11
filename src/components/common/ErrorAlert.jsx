import { AlertCircle, X } from 'lucide-react';
import clsx from 'clsx';

export default function ErrorAlert({
  message,
  onDismiss,
  type = 'error',
  className = '',
}) {
  const typeClasses = {
    error: 'border-red-200/60 bg-red-50 text-red-800',
    warning: 'border-amber-200/60 bg-amber-50 text-amber-800',
    info: 'border-[#007AFF]/20 bg-[#007AFF]/5 text-[#007AFF]',
  };

  const iconClasses = {
    error: 'text-[#FF3B30]',
    warning: 'text-[#FF9500]',
    info: 'text-[#007AFF]',
  };

  return (
    <div className={clsx('rounded-xl border p-4', typeClasses[type], className)}>
      <div className="flex items-start gap-3">
        <AlertCircle className={clsx('mt-0.5 h-5 w-5 shrink-0', iconClasses[type])} />
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        {onDismiss && (
          <button type="button" onClick={onDismiss} className="shrink-0">
            <X className={clsx('h-4 w-4', iconClasses[type])} />
          </button>
        )}
      </div>
    </div>
  );
}
