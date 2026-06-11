import { useState, useEffect } from 'react';
import { LottieLoader } from '../common/Lottie';

let Chart = null;

const loadChart = async () => {
  if (typeof window !== 'undefined' && !Chart) {
    const { default: ReactApexCharts } = await import('react-apexcharts');
    Chart = ReactApexCharts;
  }
  return Chart;
};

export default function ChartWrapper({
  options,
  series,
  type = 'line',
  height = 300,
  loading = false,
  error = null,
  className = '',
}) {
  const [chartLoaded, setChartLoaded] = useState(false);
  const [chartError, setChartError] = useState(null);

  useEffect(() => {
    loadChart()
      .then((chartComponent) => {
        if (chartComponent) {
          Chart = chartComponent;
          setChartLoaded(true);
        }
      })
      .catch((err) => {
        console.error('Failed to load chart component:', err);
        setChartError('Failed to load chart component');
      });
  }, []);

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ height: `${height}px` }}
      >
        <LottieLoader size="md" label="Loading chart..." centered />
      </div>
    );
  }

  if (error || chartError) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ height: `${height}px` }}
      >
        <div className="text-center">
          <p className="mb-2 text-[#FF3B30]">Failed to load chart</p>
          <p className="text-sm text-gray-500">{error || chartError}</p>
        </div>
      </div>
    );
  }

  if (!chartLoaded) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ height: `${height}px` }}
      >
        <LottieLoader size="md" label="Loading chart library..." centered />
      </div>
    );
  }

  if (!series || series.length === 0) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ height: `${height}px` }}
      >
        <div className="text-center">
          <p className="mb-2 text-gray-500">No data available</p>
          <p className="text-sm text-gray-400">Chart will appear when data is available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Chart options={options} series={series} type={type} height={height} />
    </div>
  );
}
