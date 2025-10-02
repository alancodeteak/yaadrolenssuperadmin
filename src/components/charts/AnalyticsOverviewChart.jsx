import ChartWrapper from './ChartWrapper'

export default function AnalyticsOverviewChart({ 
  analytics = [], 
  loading = false, 
  error = null 
}) {
  // Process analytics data for the chart
  const processedData = analytics.map(item => ({
    x: new Date(item.date).toLocaleDateString(),
    y: item.value || 0
  }))

  const chartOptions = {
    chart: {
      type: 'line',
      height: 300,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    colors: ['#3B82F6'],
    xaxis: {
      type: 'category',
      title: {
        text: 'Date'
      },
      labels: {
        rotate: -45
      }
    },
    yaxis: {
      title: {
        text: 'Value'
      }
    },
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 5
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (value) {
          return value + ' units'
        }
      }
    },
    legend: {
      show: true,
      position: 'top'
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
    name: 'Analytics Data',
    data: processedData
  }]

  return (
    <ChartWrapper
      options={chartOptions}
      series={chartSeries}
      type="line"
      height={350}
      loading={loading}
      error={error}
    />
  )
}
