import { Building2, Calendar, Clock, Users, UserCircle, Hash } from 'lucide-react';
import ShopStatusBadge from './ShopStatusBadge';
import Card from '../common/Card/Card';

export default function ShopInfoDisplay({ shop }) {
  if (!shop) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const code = shop.code || shop.shop_code;

  return (
    <div className="space-y-4">
      <Card variant="panel" bodyClassName="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#007AFF]/10 text-[#007AFF]">
              <Building2 className="h-7 w-7" strokeWidth={2} />
            </span>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{shop.name}</h2>
              <p className="text-sm text-gray-500">{code}</p>
            </div>
          </div>
          <ShopStatusBadge status={shop.status} isActive={shop.is_active} />
        </div>
      </Card>

      {(shop.admin_login_id || shop.admin_name) && (
        <Card variant="panel" title="Org admin" subtitle="Credentials for org portal sign-in" bodyClassName="p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {shop.admin_login_id && (
              <div className="flex items-center gap-3">
                <UserCircle className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs font-medium text-gray-500">User ID (login)</p>
                  <p className="text-sm font-semibold text-gray-900">{shop.admin_login_id}</p>
                </div>
              </div>
            )}
            {shop.admin_name && (
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Admin name</p>
                  <p className="text-sm font-semibold text-gray-900">{shop.admin_name}</p>
                </div>
              </div>
            )}
            {shop.admin_id && (
              <div className="flex items-center gap-3 md:col-span-2">
                <Hash className="h-5 w-5 text-gray-400" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500">Admin record ID</p>
                  <p className="truncate font-mono text-xs text-gray-700">{shop.admin_id}</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      <Card variant="panel" title="Overview" bodyClassName="p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-center gap-3">
            <Hash className="h-5 w-5 text-gray-400" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500">Organization ID</p>
              <p className="truncate font-mono text-xs text-gray-700">{shop.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs font-medium text-gray-500">Employees</p>
              <p className="text-sm font-semibold text-gray-900">{shop.employee_count ?? 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs font-medium text-gray-500">Created</p>
              <p className="text-sm font-semibold text-gray-900">{formatDate(shop.created_at)}</p>
            </div>
          </div>
          {shop.updated_at && (
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs font-medium text-gray-500">Last updated</p>
                <p className="text-sm font-semibold text-gray-900">{formatDate(shop.updated_at)}</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
