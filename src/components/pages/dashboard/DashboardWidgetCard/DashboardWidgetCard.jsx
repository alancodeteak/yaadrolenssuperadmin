import { Link } from 'react-router-dom';
import clsx from 'clsx';

const StatItem = ({ label, value, accent, loading, href, compact }) => {
  const valueColor = loading ? '#111827' : accent || '#111827';

  const inner = (
    <>
      <p
        className={clsx(
          'font-medium leading-snug text-gray-500',
          compact ? 'text-[10px]' : 'min-h-[2.25rem] text-xs'
        )}
      >
        {label}
      </p>
      <p
        className={clsx(
          'mt-0.5 font-bold tabular-nums tracking-tight text-gray-900',
          compact ? 'text-lg' : 'mt-1 text-2xl'
        )}
        style={{ color: valueColor }}
      >
        {loading ? '—' : value}
      </p>
    </>
  );

  const cellClass = clsx(
    'flex flex-col justify-center rounded-xl transition-colors',
    compact ? 'min-h-[52px] px-2 py-2' : 'min-h-[88px] px-3 py-3',
    href && !loading && 'hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007AFF]'
  );

  if (href && !loading) {
    return (
      <Link to={href} className={cellClass} aria-label={`${label}: ${value}`}>
        {inner}
      </Link>
    );
  }

  return <article className={cellClass}>{inner}</article>;
};

const DashboardWidgetCard = ({ title, stats = [], loading = false, className, href, compact = false }) => {
  const titleEl = href ? (
    <Link to={href} className="text-sm font-semibold text-gray-900 hover:text-[#007AFF]">
      {title}
    </Link>
  ) : (
    <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
  );

  return (
    <div
      className={clsx(
        'flex h-full flex-col rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]',
        className
      )}
    >
      <div
        className={clsx(
          'border-b border-gray-100',
          compact ? 'px-3 py-2' : 'px-4 py-3 sm:px-5'
        )}
      >
        {titleEl}
      </div>
      <div
        className={clsx(
          'grid flex-1 gap-2',
          compact ? 'grid-cols-2 p-3' : 'grid-cols-2 gap-3 p-4'
        )}
      >
        {stats.map((stat) => (
          <StatItem
            key={stat.label}
            label={stat.label}
            value={stat.value}
            accent={stat.accent}
            href={stat.href}
            loading={loading}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardWidgetCard;
