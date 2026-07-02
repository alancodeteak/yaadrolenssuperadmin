import ChartWrapper from './ChartWrapper'

export default function DemoAnalyticsBarChart({
  loading = false,
  error = null,
  totalEmployees = 0,
  activeEmployees = 0,
}) {
  const inactiveEmployees = Math.max(0, totalEmployees - activeEmployees)
  const hasData = totalEmployees > 0

  if (!loading && !error && !hasData) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/80 px-6 text-center">
        <p className="text-sm font-medium text-gray-700">No employee data yet</p>
        <p className="mt-1 text-xs text-gray-500">
          Metrics will appear once this organization has enrolled employees.
        </p>
      </div>
    )
  }

  const chartData = [
    { name: 'Active', value: activeEmployees },
    { name: 'Inactive', value: inactiveEmployees },
  ]

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 300,
      toolbar: {
        show: false,
      },
    },
    colors: ['#34C759', '#FF9500'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '50%',
        distributed: true,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        colors: ['#fff'],
      },
    },
    xaxis: {
      categories: chartData.map((item) => item.name),
      title: {
        text: 'Employee status',
      },
    },
    yaxis: {
      title: {
        text: 'Count',
      },
      min: 0,
      forceNiceScale: true,
      labels: {
        formatter: (val) => Math.round(val),
      },
    },
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 5,
    },
    tooltip: {
      y: {
        formatter: (val) => `${Math.round(val)} employees`,
      },
    },
    legend: {
      show: false,
    },
  }

  const chartSeries = [
    {
      name: 'Employees',
      data: chartData.map((item) => item.value),
    },
  ]

  return (
    <ChartWrapper
      options={chartOptions}
      series={chartSeries}
      type="bar"
      height={350}
      loading={loading}
      error={error}
    />
  )
}
