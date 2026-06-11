import { AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';
import ButtonSpinner from './ButtonSpinner/ButtonSpinner';

const VARIANTS = {
  primary: {
    icon: CheckCircle2,
    iconWrap: 'bg-[#007AFF]/10 text-[#007AFF]',
    confirmClass:
      'rounded-xl bg-[#007AFF] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0066DD] disabled:cursor-not-allowed disabled:opacity-50',
  },
  destructive: {
    icon: AlertTriangle,
    iconWrap: 'bg-red-50 text-[#FF3B30]',
    confirmClass:
      'rounded-xl bg-[#FF3B30] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#E0352B] disabled:cursor-not-allowed disabled:opacity-50',
  },
  neutral: {
    icon: HelpCircle,
    iconWrap: 'bg-gray-100 text-gray-600',
    confirmClass:
      'rounded-xl bg-[#007AFF] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0066DD] disabled:cursor-not-allowed disabled:opacity-50',
  },
};

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  type,
  confirmButtonClass,
  isLoading = false,
  confirmDisabled = false,
}) => {
  if (!isOpen) return null;

  const resolvedVariant = type === 'danger' ? 'destructive' : variant;
  const config = VARIANTS[resolvedVariant] || VARIANTS.primary;
  const Icon = config.icon;
  const confirmClass = confirmButtonClass || config.confirmClass;
  const content = children || message;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-dialog-title"
      >
        <div className="px-5 py-5">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.iconWrap}`}
            >
              <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <h3 id="confirmation-dialog-title" className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
              {content && (
                <div className="mt-1.5 text-sm leading-relaxed text-gray-500">{content}</div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl border border-gray-200/60 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading || confirmDisabled}
              className={`inline-flex items-center gap-2 ${confirmClass}`}
            >
              {isLoading && <ButtonSpinner size="sm" className="text-white" />}
              {isLoading ? 'Processing…' : confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
