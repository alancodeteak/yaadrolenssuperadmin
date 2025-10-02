import { useState, useEffect } from 'react'
import LoadingSpinner from '../common/LoadingSpinner'

let Chart = null

// Dynamically import ApexCharts to avoid SSR issues
const loadChart = async () => {
  if (typeof window !== 'undefined' && !Chart) {
    const { default: ReactApexCharts } = await import('react-apexcharts')
    Chart = ReactApexCharts
  }
  return Chart
}

export default function ChartWrapper({ 
  options, 
  series, 
  type = 'line', 
  height = 300,
  loading = false,
  error = null,
  className = '' 
}) {
  const [chartLoaded, setChartLoaded] = useState(false)
  const [chartError, setChartError] = useState(null)

  useEffect(() => {
    loadChart()
      .then((chartComponent) => {
        if (chartComponent) {
          Chart = chartComponent
          setChartLoaded(true)
        }
      })
      .catch((err) => {
        console.error('Failed to load chart component:', err)
        setChartError('Failed to load chart component')
      })
  }, [])

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height: `${height}px` }}>
        <LoadingSpinner text="Loading chart..." />
      </div>
    )
  }

  if (error || chartError) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height: `${height}px` }}>
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load chart</p>
          <p className="text-sm text-gray-500">{error || chartError}</p>
        </div>
      </div>
    )
  }

  if (!chartLoaded) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height: `${height}px` }}>
        <LoadingSpinner text="Loading chart library..." />
      </div>
    )
  }

  if (!series || series.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height: `${height}px` }}>
        <div className="text-center">
          <p className="text-gray-500 mb-2">No data available</p>
          <p className="text-sm text-gray-400">Chart will appear when data is available</p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <Chart
        options={options}
        series={series}
        type={type}
        height={height}
      />
    </div>
  )
}
