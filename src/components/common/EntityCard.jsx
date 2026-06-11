import clsx from 'clsx';
import { Building2, Users, Clock, Eye, Edit, Trash2, UserCircle } from 'lucide-react';
import { DASHBOARD_PANEL } from '../../theme/dashboardTheme';

export default function EntityCard({ entity, onView, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const code = entity.code || entity.shop_code || '';
  const isActive = entity.status === 'active' || entity.is_active === true;

  return (
    <div className={clsx(DASHBOARD_PANEL, 'flex flex-col p-4 sm:p-5')}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#007AFF]/10 text-[#007AFF]">
            <Building2 className="h-5 w-5" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-gray-900">{entity.name}</h3>
            <p className="truncate text-xs text-gray-500">{code}</p>
          </div>
        </div>
        <span
          className={clsx(
            'shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
            isActive ? 'bg-[#34C759]/10 text-[#34C759]' : 'bg-gray-100 text-gray-500'
          )}
        >
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4 text-gray-400" />
          <span>{entity.employee_count ?? 0} employees</span>
        </div>
        {entity.admin_login_id && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <UserCircle className="h-4 w-4 text-gray-400" />
            <span className="truncate">
              Admin ID: <span className="font-medium text-gray-800">{entity.admin_login_id}</span>
            </span>
          </div>
        )}
        <div className="flex items-center gap-1 border-t border-gray-100 pt-2 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          <span>Created {formatDate(entity.created_at)}</span>
        </div>
      </div>

      <div className="mt-auto flex gap-2">
        <button
          type="button"
          onClick={() => onView(entity)}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#007AFF] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#0066DD]"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </button>
        <button
          type="button"
          onClick={() => onEdit(entity)}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200/60 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          <Edit className="h-3.5 w-3.5" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(entity)}
          disabled={!isActive}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-200/60 bg-red-50 px-3 py-2 text-xs font-semibold text-[#FF3B30] transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Disable
        </button>
      </div>
    </div>
  );
}
