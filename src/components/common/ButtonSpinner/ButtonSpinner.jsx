import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

const SIZES = {
  sm: 14,
  md: 16,
  lg: 18,
};

const ButtonSpinner = ({ size = 'md', className }) => (
  <Loader2
    className={clsx('animate-spin shrink-0', className)}
    size={typeof size === 'number' ? size : SIZES[size] || SIZES.md}
    strokeWidth={2}
    aria-hidden
  />
);

export default ButtonSpinner;
