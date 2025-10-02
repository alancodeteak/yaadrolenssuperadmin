import ChartWrapper from './ChartWrapper'

export default function EmployeeStatusPieChart({ 
  totalEmployees = 0, 
  activeEmployees = 0, 
  loading = false, 
  error = null 
}) {
  const inactiveEmployees = totalEmployees - activeEmployees

  const chartOptions = {
    chart: {
      type: 'pie',
      height: 300,
    },
    labels: ['Active Employees', 'Inactive Employees'],
    colors: ['#10B981', '#EF4444'],
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return opts.w.config.series[opts.seriesIndex] + ' (' + val.toFixed(1) + '%)'
      }
    },
    legend: {
      position: 'bottom',
      fontSize: '14px',
    },
    tooltip: {
      y: {
        formatter: function (value) {
          return value + ' employees'
        }
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: function (w) {
                return totalEmployees
              }
            }
          }
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  }

  const chartSeries = [activeEmployees, inactiveEmployees]

  return (
    <ChartWrapper
      options={chartOptions}
      series={chartSeries}
      type="pie"
      height={350}
      loading={loading}
      error={error}
    />
  )
}
