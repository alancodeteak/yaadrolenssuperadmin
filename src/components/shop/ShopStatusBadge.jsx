import clsx from 'clsx';
import { CheckCircle, XCircle } from 'lucide-react';

export default function ShopStatusBadge({ isActive, status, className = '' }) {
  const active = status ? status === 'active' : isActive;

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
        active ? 'bg-[#34C759]/10 text-[#34C759]' : 'bg-gray-100 text-gray-500',
        className
      )}
    >
      {active ? (
        <CheckCircle className="h-3.5 w-3.5" />
      ) : (
        <XCircle className="h-3.5 w-3.5" />
      )}
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}
