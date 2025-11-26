import Chart from 'react-apexcharts';
import { useTheme } from '../../contexts/ThemeContext';

const BarChartOne = () => {
  const { darkMode } = useTheme();

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
        columnWidth: '39%',
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
        show: false,
      },
      y: {
  formatter: (val) => `${val}`,
      },
    },
  };

  const series = [
    {
      name: 'Donations',
      data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112],
    },
  ];

  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div id="chartOne" className="min-w-[1000px]">
     <Chart options={options} series={series} type="bar" height={180} />
  </div>
    </div>
  );
};

export default BarChartOne;
