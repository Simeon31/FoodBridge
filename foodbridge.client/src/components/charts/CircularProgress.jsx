import Chart from 'react-apexcharts';

const CircularProgress = ({ percentage = 75.55, title = 'Monthly Target' }) => {
  const options = {
    chart: {
   type: 'radialBar',
      fontFamily: 'Inter, sans-serif',
    },
    plotOptions: {
      radialBar: {
   hollow: {
       size: '70%',
      },
        track: {
       background: '#e5e7eb',
          strokeWidth: '100%',
        },
 dataLabels: {
    name: {
    show: false,
   },
      value: {
         fontSize: '32px',
       fontWeight: 'bold',
       color: '#1f2937',
   offsetY: 10,
            formatter: (val) => `${val}%`,
          },
        },
      },
    },
    colors: ['#3c50e0'],
    stroke: {
   lineCap: 'round',
    },
  };

  const series = [percentage];

  return (
    <div className="flex flex-col items-center">
      <Chart options={options} series={series} type="radialBar" height={300} />
    </div>
  );
};

export default CircularProgress;
