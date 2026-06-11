import clsx from 'clsx';

const Card = ({
  children,
  title,
  subtitle,
  className = '',
  titleClassName = '',
  bodyClassName = '',
  variant = 'default',
  ...props
}) => {
  const isPanel = variant === 'panel';

  const shellClass = isPanel
    ? 'rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]'
    : 'rounded-xl border border-gray-100 bg-white shadow-sm';

  return (
    <div className={clsx(shellClass, className)} {...props}>
      {title && (
        <div
          className={clsx(
            'border-b border-gray-100',
            isPanel ? 'px-4 py-3 sm:px-5' : 'px-6 py-4',
            titleClassName
          )}
        >
          <h3
            className={clsx(
              'font-semibold text-gray-900',
              isPanel ? 'text-sm' : 'text-lg tracking-tight'
            )}
          >
            {title}
          </h3>
          {subtitle && (
            <p className="mt-0.5 text-[11px] text-gray-500">{subtitle}</p>
          )}
        </div>
      )}
      <div className={clsx(isPanel ? 'p-4 sm:p-5' : 'px-6 py-5', bodyClassName)}>
        {children}
      </div>
    </div>
  );
};

export default Card;
