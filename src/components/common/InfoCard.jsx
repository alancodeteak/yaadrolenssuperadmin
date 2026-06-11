import clsx from 'clsx';
import { DASHBOARD_PANEL } from '../../theme/dashboardTheme';

export default function InfoCard({
  title,
  value,
  icon: Icon,
  accent = '#007AFF',
  className = '',
}) {
  return (
    <div className={clsx(DASHBOARD_PANEL, 'p-4 sm:p-5', className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-gray-900">{value}</p>
        </div>
        {Icon && (
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${accent}1A`, color: accent }}
          >
            <Icon className="h-5 w-5" strokeWidth={2} />
          </span>
        )}
      </div>
    </div>
  );
}
