import clsx from 'clsx';
import { ArrowRight, CheckCircle2, ScanFace, User, XCircle } from 'lucide-react';
import { DASHBOARD_ACCENTS } from '../../theme/dashboardTheme';

const THRESHOLD_MIN = 0.5;
const THRESHOLD_MAX = 0.99;
const EXAMPLE_BEST = 0.82;
const EXAMPLE_SECOND = 0.76;
const EXAMPLE_GAP = EXAMPLE_BEST - EXAMPLE_SECOND;

const EXAMPLE_CANDIDATES = [
  { id: 'best', name: 'Priya N.', role: 'Best match', score: EXAMPLE_BEST },
  { id: 'second', name: 'Rahul K.', role: 'Second match', score: EXAMPLE_SECOND },
];

const toPercent = (value, min, max) =>
  Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

function StatusPill({ ok, label }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold',
        ok ? 'bg-[#34C759]/10 text-[#248A3D]' : 'bg-[#FF3B30]/10 text-[#C62828]'
      )}
    >
      {ok ? (
        <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
      ) : (
        <XCircle className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
      )}
      {label}
    </span>
  );
}

function FaceAvatar({ name, highlight, dimmed, score, selected }) {
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <div
      className={clsx(
        'flex flex-col items-center gap-2 rounded-xl border bg-white p-3 transition-all duration-200',
        selected && 'border-[#34C759] bg-[#34C759]/5 shadow-sm ring-2 ring-[#34C759]/20',
        highlight && !selected && 'border-[#007AFF]/40 bg-[#007AFF]/5',
        dimmed && 'border-gray-200/80 opacity-70',
        !highlight && !dimmed && !selected && 'border-gray-200/80'
      )}
    >
      <div
        className={clsx(
          'relative flex h-14 w-14 items-center justify-center rounded-full border-2 bg-gray-50',
          selected && 'border-[#34C759]',
          highlight && !selected && 'border-[#007AFF]',
          dimmed && 'border-gray-300',
          !highlight && !dimmed && !selected && 'border-gray-200'
        )}
      >
        <span className="text-lg font-bold text-gray-700">{initial}</span>
        {selected && (
          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#34C759] text-white">
            <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} />
          </span>
        )}
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold text-gray-900">{name}</p>
        <p className="font-mono text-[11px] font-semibold text-[#007AFF]">{score.toFixed(2)}</p>
      </div>
    </div>
  );
}

function KioskScanFace({ matchAccepted, passesThreshold }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={clsx(
          'relative flex h-36 w-28 flex-col items-center justify-center rounded-2xl border-2 bg-white shadow-sm transition-colors duration-200',
          matchAccepted
            ? 'border-[#34C759]/50'
            : passesThreshold
              ? 'border-[#FF9500]/50'
              : 'border-[#FF3B30]/50'
        )}
      >
        <span
          className="pointer-events-none absolute left-2 top-2 h-4 w-4 border-l-2 border-t-2 border-[#007AFF]/70"
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute right-2 top-2 h-4 w-4 border-r-2 border-t-2 border-[#007AFF]/70"
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute bottom-2 left-2 h-4 w-4 border-b-2 border-l-2 border-[#007AFF]/70"
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 border-[#007AFF]/70"
          aria-hidden="true"
        />

        <div
          className={clsx(
            'flex h-16 w-16 items-center justify-center rounded-full transition-colors duration-200',
            matchAccepted ? 'bg-[#34C759]/10' : 'bg-[#007AFF]/10'
          )}
        >
          <ScanFace
            className={clsx(
              'h-10 w-10 transition-colors duration-200',
              matchAccepted ? 'text-[#34C759]' : 'text-[#007AFF]'
            )}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </div>

        <div className="absolute inset-x-3 top-1/2 h-px bg-[#007AFF]/20" aria-hidden="true" />
        <div
          className="absolute inset-x-3 top-1/2 h-px animate-pulse bg-[#007AFF]/40"
          aria-hidden="true"
        />
      </div>
      <p className="mt-2 text-[11px] font-semibold text-gray-700">Kiosk scan</p>
      <p className="text-[10px] text-gray-500">Live face at tablet</p>
    </div>
  );
}

function FaceMatchScene({ matchAccepted, passesThreshold, passesAmbiguity }) {
  const ambiguous = passesThreshold && !passesAmbiguity;

  return (
    <div className="rounded-xl border border-gray-200/60 bg-white p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Live example
      </p>
      <div className="flex flex-col items-center gap-4 lg:flex-row lg:justify-center">
        <KioskScanFace matchAccepted={matchAccepted} passesThreshold={passesThreshold} />

        <div className="flex flex-col items-center gap-1 text-gray-400">
          <ArrowRight className="h-5 w-5 lg:rotate-0 rotate-90" strokeWidth={2} aria-hidden="true" />
          <span className="text-[10px] font-medium">Compare</span>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-center text-[11px] font-medium text-gray-600 lg:text-left">
            Enrolled employees
          </p>
          <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
            {EXAMPLE_CANDIDATES.map((candidate, index) => (
              <FaceAvatar
                key={candidate.id}
                name={candidate.name}
                score={candidate.score}
                selected={matchAccepted && index === 0}
                highlight={ambiguous && index < 2}
                dimmed={!passesThreshold || (ambiguous && index === 0)}
              />
            ))}
          </div>
          {ambiguous && (
            <p className="max-w-[220px] text-center text-[10px] text-[#FF9500] lg:text-left">
              Both faces score too close — kiosk cannot pick a winner safely.
            </p>
          )}
          {!passesThreshold && (
            <p className="max-w-[220px] text-center text-[10px] text-[#FF3B30] lg:text-left">
              Scan score is below your minimum threshold — no one is selected.
            </p>
          )}
        </div>
      </div>

      {matchAccepted && (
        <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-[#34C759]/10 px-3 py-2 text-xs font-semibold text-[#248A3D]">
          <User className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
          Clock-in recorded for {EXAMPLE_CANDIDATES[0].name}
        </div>
      )}
    </div>
  );
}

function ScoreBar({ label, score, accent }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px] text-gray-500">
        <span>{label}</span>
        <span className="font-mono font-semibold text-gray-900">{score.toFixed(2)}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full transition-all duration-200"
          style={{ width: `${score * 100}%`, backgroundColor: accent }}
        />
      </div>
    </div>
  );
}

export default function FaceMatchingPreview({ similarityThreshold, ambiguityGap }) {
  const threshold = Number(similarityThreshold);
  const gap = Number(ambiguityGap);
  const thresholdValid =
    !Number.isNaN(threshold) && threshold >= THRESHOLD_MIN && threshold <= THRESHOLD_MAX;
  const gapValid = !Number.isNaN(gap) && gap >= 0.01 && gap <= 0.5;

  const passesThreshold = thresholdValid && EXAMPLE_BEST >= threshold;
  const passesAmbiguity = gapValid && EXAMPLE_GAP >= gap;
  const matchAccepted = passesThreshold && passesAmbiguity;

  const thresholdMarker = thresholdValid
    ? toPercent(threshold, THRESHOLD_MIN, THRESHOLD_MAX)
    : toPercent(0.75, THRESHOLD_MIN, THRESHOLD_MAX);
  const exampleMarker = toPercent(EXAMPLE_BEST, THRESHOLD_MIN, THRESHOLD_MAX);

  return (
    <div className="mt-6 space-y-4 rounded-xl border border-gray-200/60 bg-gray-50/60 p-4">
      <div>
        <p className="text-sm font-semibold text-gray-900">How matching works</p>
        <p className="mt-0.5 text-xs text-gray-500">
          Example kiosk scan — adjust sliders above to see how rules apply.
        </p>
      </div>

      <FaceMatchScene
        matchAccepted={matchAccepted}
        passesThreshold={passesThreshold}
        passesAmbiguity={passesAmbiguity}
      />

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-medium text-gray-600">Minimum match score</span>
          {thresholdValid && (
            <StatusPill
              ok={passesThreshold}
              label={passesThreshold ? 'Score passes' : 'Score too low'}
            />
          )}
        </div>
        <div className="relative pt-1">
          <div className="relative h-3 overflow-hidden rounded-full bg-gray-200">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-[#FF3B30]/25 transition-all duration-200"
              style={{ width: `${thresholdMarker}%` }}
            />
            <div
              className="absolute inset-y-0 rounded-full bg-[#34C759]/35 transition-all duration-200"
              style={{ left: `${thresholdMarker}%`, right: 0 }}
            />
            <div
              className="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-gray-900 transition-all duration-200"
              style={{ left: `calc(${thresholdMarker}% - 1px)` }}
              title={`Threshold ${thresholdValid ? threshold.toFixed(2) : '—'}`}
            />
            <div
              className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-sm transition-all duration-200"
              style={{
                left: `${exampleMarker}%`,
                backgroundColor: DASHBOARD_ACCENTS.blue,
              }}
              title={`Example scan ${EXAMPLE_BEST.toFixed(2)}`}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] font-medium text-gray-400">
            <span>{THRESHOLD_MIN.toFixed(2)}</span>
            <span className="text-gray-600">
              Threshold {thresholdValid ? threshold.toFixed(2) : '—'}
            </span>
            <span>{THRESHOLD_MAX.toFixed(2)}</span>
          </div>
        </div>
        <p className="text-[11px] text-gray-500">
          Blue dot = example scan ({EXAMPLE_BEST.toFixed(2)}). Black line = minimum required score.
        </p>
      </div>

      <div className="space-y-3 border-t border-gray-200/80 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-medium text-gray-600">Ambiguity gap</span>
          {gapValid && (
            <StatusPill
              ok={passesAmbiguity}
              label={passesAmbiguity ? 'Gap sufficient' : 'Too ambiguous'}
            />
          )}
        </div>
        <ScoreBar label="Best match" score={EXAMPLE_BEST} accent={DASHBOARD_ACCENTS.blue} />
        <ScoreBar label="Second match" score={EXAMPLE_SECOND} accent={DASHBOARD_ACCENTS.gray} />
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 text-xs">
          <span className="text-gray-600">
            Gap between matches:{' '}
            <span className="font-mono font-semibold text-gray-900">{EXAMPLE_GAP.toFixed(2)}</span>
          </span>
          <span className="text-gray-500">
            Required:{' '}
            <span className="font-mono font-semibold text-gray-900">
              {gapValid ? gap.toFixed(2) : '—'}
            </span>
          </span>
        </div>
      </div>

      <div
        className={clsx(
          'flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold',
          matchAccepted
            ? 'border-[#34C759]/30 bg-[#34C759]/10 text-[#248A3D]'
            : 'border-[#FF9500]/30 bg-[#FF9500]/10 text-[#C77700]'
        )}
      >
        {matchAccepted ? (
          <>
            <CheckCircle2 className="h-4 w-4 shrink-0" strokeWidth={2.5} />
            Example scan would be accepted
          </>
        ) : (
          <>
            <XCircle className="h-4 w-4 shrink-0" strokeWidth={2.5} />
            Example scan would be rejected
            {!passesThreshold && thresholdValid ? ' — score below threshold' : ''}
            {passesThreshold && !passesAmbiguity && gapValid ? ' — ambiguous match' : ''}
          </>
        )}
      </div>
    </div>
  );
}
