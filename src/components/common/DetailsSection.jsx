import { DASHBOARD_PANEL } from '../../theme/dashboardTheme';

export default function DetailsSection({ title, children, className = '' }) {
  return (
    <div className={`${DASHBOARD_PANEL} overflow-hidden ${className}`}>
      <div className="border-b border-gray-100 px-4 py-3 sm:px-5">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}
