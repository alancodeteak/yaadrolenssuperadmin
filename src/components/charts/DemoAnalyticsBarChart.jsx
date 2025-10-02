import ChartWrapper from './ChartWrapper'

export default function DemoAnalyticsBarChart({ 
  loading = false, 
  error = null 
}) {
  // Demo data for demonstration
  const demoData = [
    { name: 'Attendance Rate', value: 92.5 },
    { name: 'Productivity', value: 87.3 },
    { name: 'Efficiency', value: 94.1 },
    { name: 'Quality Score', value: 89.7 },
    { name: 'Customer Satisfaction', value: 91.2 }
  ]

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 300,
      toolbar: {
        show: false
      }
    },
    colors: ['#8B5CF6'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%',
        distributed: false
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toFixed(1) + '%'
      },
      style: {
        fontSize: '12px',
        colors: ['#fff']
      }
    },
    xaxis: {
      categories: demoData.map(item => item.name),
      title: {
        text: 'Metrics'
      },
      labels: {
        rotate: -45,
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Percentage (%)'
      },
      min: 0,
      max: 100,
      labels: {
        formatter: function (val) {
          return val.toFixed(0) + '%'
        }
      }
    },
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 5
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toFixed(1) + '%'
        }
      }
    },
    responsive: [{
      breakpoint: 768,
      options: {
        chart: {
          height: 250
        },
        xaxis: {
          labels: {
            rotate: -90
          }
        }
      }
    }]
  }

  const chartSeries = [{
    name: 'Performance',
    data: demoData.map(item => item.value)
  }]

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
