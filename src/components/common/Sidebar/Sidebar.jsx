import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Building2, LogOut } from 'lucide-react';
import { useAppDispatch } from '../../../store/hooks';
import { logout } from '../../../store/slices/authSlice';
import SidebarNavItem from './SidebarNavItem';
import { sidebarRowClass, sidebarRowPadding } from './sidebarLayout';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/', icon: Home, match: (path) => path === '/' || path === '/dashboard' },
  {
    name: 'Organizations',
    href: '/companies',
    icon: Building2,
    match: (path) => path.startsWith('/companies') || path.startsWith('/organizations'),
  },
];

const YAADRO_LOGO = '/assets/yadro-logo-blue.png';
const CODETEAK_LOGO = '/assets/Copy of logo-with-text-ho.png';
const CODETEAK_URL = 'https://www.codeteak.com/';

const sectionLabelClass =
  'mb-1 h-5 text-[11px] font-medium uppercase leading-5 tracking-wide text-gray-400';

const SidebarHeader = ({ collapsed }) => (
  <div className="mb-3 shrink-0 border-b border-gray-100 pb-3">
    <div className={sidebarRowClass(collapsed)}>
      <img
        src={YAADRO_LOGO}
        alt="YaadroLens"
        className="h-10 w-10 shrink-0 rounded-xl object-contain shadow-[0_2px_8px_rgba(0,122,255,0.25)]"
      />
      <div
        className={clsx(
          'min-w-0 overflow-hidden transition-[opacity,width] duration-200',
          collapsed ? 'w-0 opacity-0' : 'opacity-100'
        )}
        aria-hidden={collapsed}
      >
        <p className="truncate text-sm font-semibold text-gray-900">YaadroLens</p>
        <p className="truncate text-[11px] text-gray-500">Super Admin</p>
      </div>
    </div>

    <div
      className={clsx(
        'overflow-hidden transition-[height,opacity] duration-200',
        collapsed ? 'h-0 opacity-0' : 'h-14 opacity-100'
      )}
    >
      <a
        href={CODETEAK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(
          'mt-2 flex flex-col gap-1 rounded-xl py-1 transition-colors hover:bg-gray-50',
          sidebarRowPadding(collapsed)
        )}
        aria-label="Powered by CodeTeak — opens codeteak.com"
        tabIndex={collapsed ? -1 : undefined}
      >
        <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
          Powered by
        </span>
        <img
          src={CODETEAK_LOGO}
          alt="CodeTeak"
          className="h-6 w-auto max-w-[180px] object-contain object-left"
        />
      </a>
    </div>
  </div>
);

const SidebarFooter = ({ collapsed, onLogout }) => (
  <div className="mt-auto shrink-0 border-t border-gray-100 pt-3">
    <button
      type="button"
      onClick={onLogout}
      title={collapsed ? 'Log out' : undefined}
      className={sidebarRowClass(
        collapsed,
        'rounded-xl font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-[#FF3B30]'
      )}
    >
      <LogOut className="h-[18px] w-[18px] shrink-0" strokeWidth={2} aria-hidden="true" />
      <span
        className={clsx(
          'truncate text-sm transition-[opacity,width] duration-200',
          collapsed ? 'w-0 opacity-0' : 'opacity-100'
        )}
        aria-hidden={collapsed}
      >
        Log out
      </span>
    </button>
  </div>
);

const SidebarPanel = ({ collapsed, location, onNavClick, onLogout }) => (
  <div className="flex h-full min-h-0 flex-col">
    <SidebarHeader collapsed={collapsed} />

    <nav
      aria-label="Main navigation"
      className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden"
    >
      <p className={clsx(sectionLabelClass, sidebarRowPadding(collapsed), collapsed && 'invisible')}>
        Menu
      </p>

      {NAV_ITEMS.map((item) => (
        <SidebarNavItem
          key={item.name}
          icon={item.icon}
          label={item.name}
          collapsed={collapsed}
          isActive={item.match(location.pathname)}
          onClick={() => onNavClick(item.href)}
        />
      ))}
    </nav>

    <SidebarFooter collapsed={collapsed} onLogout={onLogout} />
  </div>
);

const Sidebar = ({ className, forceExpanded = false, onNavigate, onExpandedChange }) => {
  const [hovered, setHovered] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const expanded = forceExpanded || hovered;
  const collapsed = !expanded;

  useEffect(() => {
    if (forceExpanded) return;
    onExpandedChange?.(hovered);
  }, [hovered, forceExpanded, onExpandedChange]);

  const handleNavClick = (href) => {
    navigate(href);
    onNavigate?.();
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <aside
      onMouseEnter={() => !forceExpanded && setHovered(true)}
      onMouseLeave={() => !forceExpanded && setHovered(false)}
      className={clsx(
        'z-40 shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out',
        forceExpanded
          ? 'fixed inset-y-0 left-0 flex h-screen w-[260px]'
          : 'hidden h-screen w-[72px] lg:fixed lg:inset-y-0 lg:left-0 lg:flex',
        !forceExpanded && hovered && 'lg:w-[260px]',
        className
      )}
    >
      <div
        className={clsx(
          'flex h-full w-full flex-col overflow-hidden py-3',
          forceExpanded
            ? 'border-r border-gray-200/60 bg-white pl-3 pr-3'
            : clsx(
                'my-3 ml-2 rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]',
                collapsed ? 'pl-0 pr-0' : 'pl-3 pr-3'
              )
        )}
      >
        <SidebarPanel
          collapsed={collapsed}
          location={location}
          onNavClick={handleNavClick}
          onLogout={handleLogout}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
