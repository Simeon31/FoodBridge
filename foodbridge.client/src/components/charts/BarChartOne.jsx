import Chart from 'react-apexcharts';
import { useTheme } from '../../contexts/ThemeContext';
import PropTypes from 'prop-types';
import { useMemo } from 'react';

const BarChartOne = ({ data = [] }) => {
  const { darkMode } = useTheme();

  // Process data for the chart
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      // Default data if none provided
      return {
     categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      };
    }

    return {
      categories: data.map(item => item.monthName),
      values: data.map(item => item.donationCount)
    };
  }, [data]);

  const options = {
    colors: ['#3c50e0'],
    chart: {
      fontFamily: 'Inter, sans-serif',
      type: 'bar',
      height: 180,
      toolbar: {
        show: false,
      },
      background: 'transparent',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 5,
        borderRadiusApplication: 'end',
  },
    },
    dataLabels: {
  enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ['transparent'],
    },
    xaxis: {
      categories: chartData.categories,
 axisBorder: {
        show: false,
      },
      axisTicks: {
    show: false,
      },
 labels: {
      style: {
colors: darkMode ? '#9CA3AF' : '#64748b',
        fontSize: '12px',
        },
        rotate: -45,
    rotateAlways: false,
        hideOverlappingLabels: true,
        trim: true,
      },
    },
    yaxis: {
      labels: {
     style: {
colors: darkMode ? '#9CA3AF' : '#64748b',
  fontSize: '12px',
        },
      },
      title: {
        text: undefined,
    },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Inter',
      labels: {
        colors: darkMode ? '#E5E7EB' : '#1F2937',
      },
    },
    grid: {
      borderColor: darkMode ? '#374151' : '#E5E7EB',
      strokeDashArray: 5,
      xaxis: {
        lines: {
     show: false,
    },
      },
      yaxis: {
    lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      theme: darkMode ? 'dark' : 'light',
      x: {
   show: true,
      },
      y: {
        formatter: (val) => `${val} donations`,
      },
    },
    responsive: [{
   breakpoint: 768,
      options: {
        plotOptions: {
          bar: {
   columnWidth: '70%',
 }
        },
  xaxis: {
          labels: {
         style: {
              fontSize: '10px',
  },
    }
 }
      }
    }]
};

  const series = [
    {
      name: 'Donations',
      data: chartData.values,
    },
  ];

  return (
    <div className="w-full overflow-x-auto custom-scrollbar">
    <div id="chartOne" className="min-w-full sm:min-w-0">
        <Chart options={options} series={series} type="bar" height={280} />
    </div>
    </div>
  );
};

BarChartOne.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    monthName: PropTypes.string,
    donationCount: PropTypes.number,
    itemCount: PropTypes.number,
  }))
};

export default BarChartOne;
