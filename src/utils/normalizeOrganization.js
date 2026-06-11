/** Map API organization + nested primary_admin to UI-friendly shape. */
export function normalizeOrganization(org) {
  if (!org) return org;

  const admin = org.primary_admin || {};

  return {
    ...org,
    is_active: org.status === 'active',
    shop_code: org.code,
    admin_id: admin.id ?? org.admin_id ?? null,
    admin_login_id: admin.login_id ?? org.admin_login_id ?? null,
    admin_name: admin.name ?? org.admin_name ?? null,
    admin_status: admin.status ?? org.admin_status ?? null,
    primary_admin: org.primary_admin ?? (admin.id ? admin : null),
  };
}
