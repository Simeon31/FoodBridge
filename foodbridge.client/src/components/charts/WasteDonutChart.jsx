import Chart from 'react-apexcharts';
import { useTheme } from '../../contexts/ThemeContext';
import PropTypes from 'prop-types';
import { useMemo } from 'react';


const WasteDonutChart = ({ wasteStats }) => {
    const { darkMode } = useTheme();

    // Calculate waste distribution
    const chartData = useMemo(() => {
        if (!wasteStats) {
            return {
                series: [0],
                labels: ['No Data']
            };
        }

        const totalQuantity = wasteStats.totalQuantityWasted;
        const wastedPercentage = wasteStats.wastePercentage;
        const savedPercentage = 100 - wastedPercentage;

        return {
            series: [wastedPercentage, savedPercentage],
            labels: ['Wasted', 'Saved'],
            totals: {
                wasted: totalQuantity,
                total: wasteStats.totalWasteRecords
            }
        };
    }, [wasteStats]);

    const options = {
        chart: {
            fontFamily: 'Inter, sans-serif',
            type: 'donut',
            height: 280,
            toolbar: {
                show: false,
            },
        },
        colors: ['#EF4444', '#10B981'], 
        labels: chartData.labels,
        legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center',
            fontFamily: 'Inter',
            labels: {
                colors: darkMode ? '#E5E7EB' : '#1F2937',
            },
            markers: {
                width: 12,
                height: 12,
                radius: 12,
            },
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '14px',
                            fontWeight: 600,
                            color: darkMode ? '#E5E7EB' : '#1F2937',
                        },
                        value: {
                            show: true,
                            fontSize: '24px',
                            fontWeight: 700,
                            color: darkMode ? '#FFFFFF' : '#000000',
                            formatter: (val) => `${parseFloat(val).toFixed(1)}%`,
                        },
                        total: {
                            show: true,
                            label: 'Waste Rate',
                            fontSize: '14px',
                            color: darkMode ? '#9CA3AF' : '#64748B',
                            formatter: () => `${chartData.series[0].toFixed(1)}%`,
                        },
                    },
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            theme: darkMode ? 'dark' : 'light',
            y: {
                formatter: (val) => `${val.toFixed(1)}%`,
            },
        },
        stroke: {
            width: 2,
            colors: darkMode ? ['#1F2937'] : ['#FFFFFF'],
        },
        responsive: [
            {
                breakpoint: 768,
                options: {
                    chart: {
                        height: 250,
                    },
                    legend: {
                        position: 'bottom',
                    },
                },
            },
        ],
    };

    return (
        <div className="w-full">
            <Chart options={options} series={chartData.series} type="donut" height={280} />

            {/* Waste Statistics Summary */}
            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-stroke dark:border-strokedark pt-4">
                <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Wasted</p>
                    <p className="text-lg font-bold text-danger">
                        {chartData.totals.wasted.toLocaleString()} kg
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Records</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {chartData.totals.total.toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

WasteDonutChart.propTypes = {
    wasteStats: PropTypes.shape({
        totalWasteRecords: PropTypes.number,
        totalQuantityWasted: PropTypes.number,
        wastePercentage: PropTypes.number,
        percentageChange: PropTypes.number,
        topWasteReason: PropTypes.string,
    }),
};

export default WasteDonutChart;
