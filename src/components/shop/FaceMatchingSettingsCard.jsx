import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchFaceMatchingSettings,
  updateFaceMatchingSettings,
} from '../../store/slices/companiesSlice';
import Card from '../common/Card/Card';
import ErrorAlert from '../common/ErrorAlert';
import { LottieLoader } from '../common/Lottie';
import FaceMatchingPreview from './FaceMatchingPreview';
import { dashboardToast } from '../../utils/dashboardToast';
import {
  DASHBOARD_BTN_PRIMARY,
  DASHBOARD_BTN_SECONDARY,
  inputClass,
  labelClass,
} from '../../theme/dashboardTheme';

const THRESHOLD_MIN = 0.5;
const THRESHOLD_MAX = 0.99;
const GAP_MIN = 0.01;
const GAP_MAX = 0.5;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function SliderField({
  id,
  label,
  hint,
  min,
  max,
  step,
  value,
  onChange,
  disabled,
  formatValue,
}) {
  const numeric = Number(value);
  const sliderValue = Number.isNaN(numeric) ? min : clamp(numeric, min, max);
  const fillPercent = ((sliderValue - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>
        <span className="font-mono text-sm font-semibold tabular-nums text-[#007AFF]">
          {formatValue(sliderValue)}
        </span>
      </div>
      <div className="relative">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={sliderValue}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-[#007AFF] disabled:opacity-50 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#007AFF] [&::-webkit-slider-thumb]:shadow-sm"
          style={{
            background: `linear-gradient(to right, #007AFF 0%, #007AFF ${fillPercent}%, #E5E7EB ${fillPercent}%, #E5E7EB 100%)`,
          }}
        />
      </div>
      <input
        type="number"
        step={step}
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
        disabled={disabled}
        aria-label={`${label} numeric input`}
      />
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

export default function FaceMatchingSettingsCard({ orgId }) {
  const dispatch = useAppDispatch();
  const {
    faceMatchingSettings,
    isLoadingFaceMatching,
    isUpdatingFaceMatching,
    faceMatchingError,
    updateFaceMatchingError,
  } = useAppSelector((state) => state.companies);

  const [similarityThreshold, setSimilarityThreshold] = useState('0.75');
  const [ambiguityGap, setAmbiguityGap] = useState('0.05');

  useEffect(() => {
    if (orgId) {
      dispatch(fetchFaceMatchingSettings(orgId));
    }
  }, [dispatch, orgId]);

  useEffect(() => {
    if (!faceMatchingSettings || String(faceMatchingSettings.organization_id) !== String(orgId)) {
      return;
    }
    setSimilarityThreshold(String(faceMatchingSettings.similarity_threshold ?? 0.75));
    setAmbiguityGap(String(faceMatchingSettings.ambiguity_gap ?? 0.05));
  }, [faceMatchingSettings, orgId]);

  const isDirty = useMemo(() => {
    if (!faceMatchingSettings || String(faceMatchingSettings.organization_id) !== String(orgId)) {
      return false;
    }
    return (
      Number(faceMatchingSettings.similarity_threshold) !== Number(similarityThreshold) ||
      Number(faceMatchingSettings.ambiguity_gap) !== Number(ambiguityGap)
    );
  }, [faceMatchingSettings, orgId, similarityThreshold, ambiguityGap]);

  const validateForm = () => {
    const errors = [];
    const threshold = Number(similarityThreshold);
    const gap = Number(ambiguityGap);
    if (Number.isNaN(threshold) || threshold < THRESHOLD_MIN || threshold > THRESHOLD_MAX) {
      errors.push(`Match threshold must be between ${THRESHOLD_MIN.toFixed(2)} and ${THRESHOLD_MAX.toFixed(2)}`);
    }
    if (Number.isNaN(gap) || gap < GAP_MIN || gap > GAP_MAX) {
      errors.push(`Ambiguity gap must be between ${GAP_MIN.toFixed(2)} and ${GAP_MAX.toFixed(2)}`);
    }
    return errors;
  };

  const handleReset = () => {
    if (!faceMatchingSettings) return;
    setSimilarityThreshold(String(faceMatchingSettings.similarity_threshold ?? 0.75));
    setAmbiguityGap(String(faceMatchingSettings.ambiguity_gap ?? 0.05));
  };

  const handleSave = async () => {
    if (!orgId || !isDirty) return;
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach((msg) => dashboardToast.error(msg));
      return;
    }
    try {
      await dispatch(
        updateFaceMatchingSettings({
          orgId,
          similarity_threshold: Number(similarityThreshold),
          ambiguity_gap: Number(ambiguityGap),
        })
      ).unwrap();
      dashboardToast.success('Face matching settings were updated.', 'Changes saved');
    } catch (err) {
      dashboardToast.error(
        typeof err === 'string' ? err : 'Could not save face matching settings.',
        'Save failed'
      );
    }
  };

  if (isLoadingFaceMatching) {
    return (
      <Card variant="panel" title="Face matching" subtitle="Loading settings…">
        <div className="flex min-h-24 items-center justify-center">
          <LottieLoader size="sm" label="Loading face matching settings..." centered />
        </div>
      </Card>
    );
  }

  if (faceMatchingError) {
    return (
      <Card
        variant="panel"
        title="Face matching"
        subtitle="Kiosk uses these when comparing scan embeddings to enrolled faces"
      >
        <ErrorAlert message={faceMatchingError} type="error" />
        <button
          type="button"
          onClick={() => dispatch(fetchFaceMatchingSettings(orgId))}
          className={`${DASHBOARD_BTN_SECONDARY} mt-3`}
        >
          Retry
        </button>
      </Card>
    );
  }

  if (!faceMatchingSettings || String(faceMatchingSettings.organization_id) !== String(orgId)) {
    return (
      <Card variant="panel" title="Face matching" subtitle="Loading settings…">
        <div className="flex min-h-24 items-center justify-center">
          <LottieLoader size="sm" label="Loading face matching settings..." centered />
        </div>
      </Card>
    );
  }

  return (
    <Card
      variant="panel"
      title="Face matching"
      subtitle="Kiosk uses these when comparing scan embeddings to enrolled faces"
    >
      {faceMatchingSettings.updated_at && (
        <p className="mb-4 text-[11px] text-gray-500">
          Last updated {new Date(faceMatchingSettings.updated_at).toLocaleString()}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <SliderField
          id="face-match-threshold"
          label="Minimum match score"
          hint="Higher = stricter (fewer false matches)."
          min={THRESHOLD_MIN}
          max={THRESHOLD_MAX}
          step={0.01}
          value={similarityThreshold}
          onChange={setSimilarityThreshold}
          disabled={isUpdatingFaceMatching}
          formatValue={(v) => v.toFixed(2)}
        />
        <SliderField
          id="face-ambiguity-gap"
          label="Ambiguity gap"
          hint="Reject when top two matches are too close."
          min={GAP_MIN}
          max={GAP_MAX}
          step={0.01}
          value={ambiguityGap}
          onChange={setAmbiguityGap}
          disabled={isUpdatingFaceMatching}
          formatValue={(v) => v.toFixed(2)}
        />
      </div>

      <FaceMatchingPreview
        similarityThreshold={similarityThreshold}
        ambiguityGap={ambiguityGap}
      />

      {updateFaceMatchingError && (
        <div className="mt-4">
          <ErrorAlert message={updateFaceMatchingError} type="error" />
        </div>
      )}

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={handleReset}
          disabled={isUpdatingFaceMatching || !isDirty}
          className={DASHBOARD_BTN_SECONDARY}
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isUpdatingFaceMatching || !isDirty}
          className={clsx(DASHBOARD_BTN_PRIMARY, isDirty && 'ring-2 ring-[#007AFF]/20')}
        >
          {isUpdatingFaceMatching ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </Card>
  );
}
