import { useState } from 'react';
import clsx from 'clsx';
import { Eye, EyeOff, LogIn, ShieldCheck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, clearError } from '../store/slices/authSlice';
import { LottieLoader } from '../components/common/Lottie';
import { labelClass, inputClass } from '../theme/dashboardTheme';

const CODETEAK_LOGO = '/assets/Copy of logo-with-text-ho.png';
const CODETEAK_URL = 'https://www.codeteak.com/';

export default function Login() {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [loginId, setLoginId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!loginId.trim()) newErrors.loginId = 'Login ID is required';
    if (!password.trim()) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});
    dispatch(clearError());

    try {
      const result = await dispatch(
        loginUser({
          login_id: loginId.trim(),
          password,
        })
      );

      if (!loginUser.fulfilled.match(result)) {
        setErrors({ general: result.payload || 'Login failed. Please try again.' });
      }
    } catch {
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitting = isSubmitting || isLoading;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-10 sm:px-6">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#007AFF]/10 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#5856D6]/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <img
            src="/assets/yadro-logo-blue.png"
            alt="YaadroLens"
            className="mx-auto h-14 w-auto"
          />
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#007AFF]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#007AFF]">
            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            Super Admin
          </span>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">Sign in to YaadroLens</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage organizations and platform settings
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)] sm:p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#007AFF]/10 text-[#007AFF]">
              <LogIn className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Super admin login</h2>
              <p className="text-[11px] text-gray-500">Enter your platform credentials</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login_id" className={labelClass}>
                Login ID
              </label>
              <input
                type="text"
                id="login_id"
                value={loginId}
                onChange={(e) => {
                  setLoginId(e.target.value);
                  if (errors.loginId) setErrors((prev) => ({ ...prev, loginId: '' }));
                }}
                placeholder="superadmin"
                className={clsx(inputClass, errors.loginId && 'border-red-300 focus:border-red-400 focus:ring-red-200')}
                disabled={submitting}
                autoComplete="username"
              />
              {errors.loginId && (
                <p className="mt-1 text-xs text-red-600">{errors.loginId}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  placeholder="Enter your password"
                  className={clsx(
                    inputClass,
                    'pr-11',
                    errors.password && 'border-red-300 focus:border-red-400 focus:ring-red-200'
                  )}
                  disabled={submitting}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 transition-colors hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" strokeWidth={2} />
                  ) : (
                    <Eye className="h-4 w-4" strokeWidth={2} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            {(errors.general || error) && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
              >
                {errors.general || error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#007AFF] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#0066DD] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <LottieLoader size="xs" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <a
            href={CODETEAK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-col items-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-gray-100/80"
            aria-label="Powered by CodeTeak — opens codeteak.com"
          >
            <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
              Powered by
            </span>
            <img
              src={CODETEAK_LOGO}
              alt="CodeTeak"
              className="h-6 w-auto max-w-[180px] object-contain"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
