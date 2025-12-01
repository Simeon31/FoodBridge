import Chart from 'react-apexcharts';
import { useTheme } from '../../contexts/ThemeContext';
import PropTypes from 'prop-types';
import { useMemo } from 'react';


const WasteReasonChart = ({ topReason, totalRecords }) => {
    const { darkMode } = useTheme();

    // Mock data for waste reasons 
    const chartData = useMemo(() => {

        return {
            categories: [
                topReason || 'Expired',
                'Quality Issues',
                'Damaged',
                'Overstock',
                'Other'
            ],
            values: [
                totalRecords * 0.4,  
                totalRecords * 0.25,
                totalRecords * 0.15, 
                totalRecords * 0.12, 
                totalRecords * 0.08  
            ]
        };
    }, [topReason, totalRecords]);

    const options = {
        colors: ['#EF4444'], // Danger red for waste
        chart: {
            fontFamily: 'Inter, sans-serif',
            type: 'bar',
            height: 250,
            toolbar: {
                show: false,
            },
            background: 'transparent',
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 4,
                borderRadiusApplication: 'end',
                distributed: false,
                dataLabels: {
                    position: 'top',
                },
            },
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => Math.round(val),
            offsetX: 30,
            style: {
                fontSize: '12px',
                colors: [darkMode ? '#E5E7EB' : '#1F2937'],
            },
        },
        stroke: {
            show: true,
            width: 2,
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
        grid: {
            borderColor: darkMode ? '#374151' : '#E5E7EB',
            strokeDashArray: 5,
            xaxis: {
                lines: {
                    show: true,
                },
            },
            yaxis: {
                lines: {
                    show: false,
                },
            },
        },
        fill: {
            opacity: 1,
        },
        tooltip: {
            theme: darkMode ? 'dark' : 'light',
            y: {
                formatter: (val) => `${Math.round(val)} records`,
            },
        },
        responsive: [
            {
                breakpoint: 768,
                options: {
                    plotOptions: {
                        bar: {
                            borderRadius: 3,
                        },
                    },
                    dataLabels: {
                        style: {
                            fontSize: '10px',
                        },
                    },
                },
            },
        ],
    };

    const series = [
        {
            name: 'Waste Records',
            data: chartData.values,
        },
    ];

    return (
        <div className="w-full">
            <Chart options={options} series={series} type="bar" height={250} />
        </div>
    );
};

WasteReasonChart.propTypes = {
    topReason: PropTypes.string,
    totalRecords: PropTypes.number,
};

WasteReasonChart.defaultProps = {
    topReason: 'Expired',
    totalRecords: 0,
};

export default WasteReasonChart;
