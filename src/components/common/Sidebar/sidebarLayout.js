import clsx from 'clsx';

export const sidebarRowPadding = (collapsed) => (collapsed ? 'px-2' : 'px-3');

export const sidebarRowClass = (collapsed, extra) =>
  clsx(
    'flex h-10 w-full min-w-0 items-center gap-3',
    sidebarRowPadding(collapsed),
    extra
  );
