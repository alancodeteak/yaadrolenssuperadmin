import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import { labelClass, inputClass } from '../../theme/dashboardTheme';

export default function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const isTextarea = type === 'textarea';
  const inputType = isPassword && showPassword ? 'text' : type;
  const fieldClass = clsx(
    inputClass,
    isPassword && 'pr-11',
    isTextarea && 'min-h-[96px] resize-y',
    error && 'border-red-300 focus:border-red-400 focus:ring-red-200'
  );

  return (
    <div className={clsx('space-y-1.5', className)}>
      <label className={labelClass}>
        {label}
        {required && <span className="ml-1 text-[#FF3B30]">*</span>}
      </label>
      <div className="relative">
        {isTextarea ? (
          <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={fieldClass}
          />
        ) : (
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={fieldClass}
        />
        )}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 transition-colors hover:text-gray-600"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" strokeWidth={2} />
            ) : (
              <Eye className="h-4 w-4" strokeWidth={2} />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
