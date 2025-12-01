import Chart from 'react-apexcharts';
import { useTheme } from '../../contexts/ThemeContext';
import PropTypes from 'prop-types';
import { useMemo } from 'react';

const LineChartOne = ({ data = [] }) => {
  const { darkMode } = useTheme();

  // Process data for the chart
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      // Default data if none provided
      return {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        donationValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        itemValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      };
    }

    return {
      categories: data.map((item) => item.monthName),
      donationValues: data.map((item) => item.donationCount),
      itemValues: data.map((item) => item.itemCount),
    };
  }, [data]);

  const options = {
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      labels: {
        colors: darkMode ? '#E5E7EB' : '#1F2937',
      },
    },
    colors: ['#3c50e0', '#80caee'],
    chart: {
      fontFamily: 'Inter, sans-serif',
      height: 310,
      type: 'area',
      toolbar: {
        show: false,
      },
      background: 'transparent',
    },
    stroke: {
      curve: 'smooth',
      width: [2, 2],
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 6,
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
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      theme: darkMode ? 'dark' : 'light',
      enabled: true,
      shared: true,
      intersect: false,
      x: {
        show: true,
      },
    },
    xaxis: {
      type: 'category',
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
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          colors: darkMode ? '#9CA3AF' : '#64748b',
        },
      },
      title: {
        text: '',
        style: {
          fontSize: '0px',
        },
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 250,
          },
          xaxis: {
            labels: {
              style: {
                fontSize: '10px',
              },
            },
          },
        },
      },
    ],
  };

  const series = [
    {
      name: 'Donations',
      data: chartData.donationValues,
    },
    {
      name: 'Items Donated',
      data: chartData.itemValues,
    },
  ];

  return (
    <div className="w-full overflow-x-auto custom-scrollbar">
      <div id="chartEight" className="min-w-full sm:min-w-0">
        <Chart options={options} series={series} type="area" height={310} />
      </div>
    </div>
  );
};

LineChartOne.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      monthName: PropTypes.string,
      donationCount: PropTypes.number,
      itemCount: PropTypes.number,
    })
  ),
};

export default LineChartOne;
