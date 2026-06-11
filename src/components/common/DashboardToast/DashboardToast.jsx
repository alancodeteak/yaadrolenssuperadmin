import { useCallback, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { AlertCircle, Check, Info, X } from 'lucide-react';

const AnimatedCheckIcon = () => (
  <svg
    className="toast-check-icon h-9 w-9 shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle className="toast-check-circle" cx="12" cy="12" r="10" fill="#34C759" />
    <path
      className="toast-check-path"
      d="M8 12.25 10.75 15 16 9"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const VARIANTS = {
  success: {
    icon: Check,
    iconWrap: 'bg-[#34C759] text-white',
    title: 'Changes saved',
    animatedIcon: AnimatedCheckIcon,
  },
  error: {
    icon: AlertCircle,
    iconWrap: 'bg-[#FF3B30] text-white',
    title: 'Something went wrong',
  },
  info: {
    icon: Info,
    iconWrap: 'bg-[#007AFF] text-white',
    title: 'Notice',
  },
};

const DashboardToast = ({
  variant = 'success',
  message,
  title,
  closeToast,
  duration = 2500,
}) => {
  const config = VARIANTS[variant] || VARIANTS.info;
  const Icon = config.icon;
  const AnimatedIcon = config.animatedIcon;
  const mountedRef = useRef(true);

  const dismiss = useCallback(() => {
    if (mountedRef.current) {
      closeToast?.();
    }
  }, [closeToast]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!closeToast || duration <= 0) return undefined;

    const timer = window.setTimeout(() => {
      dismiss();
    }, duration);

    return () => window.clearTimeout(timer);
  }, [closeToast, dismiss, duration]);

  return (
    <div className="dashboard-toast-card w-[min(100vw-2rem,420px)] overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
      <div className="flex items-start gap-3 px-4 py-3.5">
        {AnimatedIcon ? (
          <AnimatedIcon />
        ) : (
          <div
            className={clsx(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
              config.iconWrap
            )}
          >
            <Icon className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
          </div>
        )}
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-sm font-semibold text-gray-900">{title || config.title}</p>
          {message && (
            <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{message}</p>
          )}
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default DashboardToast;
