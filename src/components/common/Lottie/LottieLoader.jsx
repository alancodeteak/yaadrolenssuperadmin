import clsx from 'clsx';
import LottieAnimation from './LottieAnimation';

const SIZE_CLASSES = {
  xs: 'h-5 w-5',
  sm: 'h-12 w-12',
  md: 'h-16 w-16',
  lg: 'h-24 w-24',
  xl: 'h-32 w-32',
};

const LottieLoader = ({
  size = 'md',
  label,
  className,
  animationClassName,
  centered = false,
}) => (
  <div
    role="status"
    aria-live="polite"
    aria-label={label || 'Loading'}
    className={clsx(
      centered && 'flex flex-col items-center justify-center text-center',
      className
    )}
  >
    <LottieAnimation
      className={clsx(SIZE_CLASSES[size] || SIZE_CLASSES.md, animationClassName)}
    />
    {label && <p className="mt-3 text-sm text-gray-600">{label}</p>}
  </div>
);

export default LottieLoader;
