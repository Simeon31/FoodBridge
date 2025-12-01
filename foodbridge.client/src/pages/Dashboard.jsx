import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import StatsCard from '../components/dashboard/StatsCard';
import ChartCard from '../components/dashboard/ChartCard';
import BarChartOne from '../components/charts/BarChartOne';
import LineChartOne from '../components/charts/LineChartOne';
import WasteDonutChart from '../components/charts/WasteDonutChart';
import WasteReasonChart from '../components/charts/WasteReasonChart';
import dashboardService from '../services/dashboardService';
import { Alert } from '../components/ui';

function Dashboard() {
    const { user } = useAuth();
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await dashboardService.getStatistics();

            if (response.success && response.data) {
                setStatistics(response.data);
            } else {
                setError('Failed to load dashboard data');
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError(err.response?.data?.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    // Stats configuration - dynamic data
    const getStatsConfig = () => {
        if (!statistics) return [];

        return [
            {
                title: 'Total Donations',
                value: statistics.donations.totalDonations.toLocaleString(),
                change: `${statistics.donations.percentageChange >= 0 ? '+' : ''}${statistics.donations.percentageChange}%`,
                isPositive: statistics.donations.percentageChange >= 0,
                bgColor: 'bg-blue-100',
                darkBgColor: 'dark:bg-blue-500/10',
                iconColor: 'text-blue-600 dark:text-blue-400',
                icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                ),
            },
            {
                title: 'Inventory Items',
                value: statistics.inventory.totalItems.toLocaleString(),
                change: `${statistics.inventory.percentageChange >= 0 ? '+' : ''}${statistics.inventory.percentageChange}%`,
                isPositive: statistics.inventory.percentageChange >= 0,
                bgColor: 'bg-purple-100',
                darkBgColor: 'dark:bg-purple-500/10',
                iconColor: 'text-purple-600 dark:text-purple-400',
                icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                ),
            },
            {
                title: 'Active Donors',
                value: statistics.donors.activeDonors.toLocaleString(),
                change: `${statistics.donors.percentageChange >= 0 ? '+' : ''}${statistics.donors.percentageChange}%`,
                isPositive: statistics.donors.percentageChange >= 0,
                bgColor: 'bg-green-100',
                darkBgColor: 'dark:bg-green-500/10',
                iconColor: 'text-green-600 dark:text-green-400',
                icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                ),
            },
            {
                title: 'Waste Rate',
                value: `${statistics.waste.wastePercentage.toFixed(1)}%`,
                change: `${statistics.waste.percentageChange >= 0 ? '+' : ''}${statistics.waste.percentageChange}%`,
                isPositive: statistics.waste.percentageChange < 0, 
                bgColor: 'bg-red-100',
                darkBgColor: 'dark:bg-red-500/10',
                iconColor: 'text-red-600 dark:text-red-400',
                icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                ),
            },
        ];
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">
                <Alert variant="danger">
                    {error}
                </Alert>
                <button
                    onClick={fetchDashboardData}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!statistics) {
        return <Alert variant="info">No dashboard data available</Alert>;
    }

    const statsConfig = getStatsConfig();

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Page Header with Breadcrumb */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-title-md2 font-bold text-black dark:text-white">
                        Dashboard
                    </h1>
                    <nav className="mt-1">
                        <ol className="flex items-center gap-2 text-sm">
                            <li>
                                <a href="/" className="text-gray-500 hover:text-primary dark:text-gray-400">Home</a>
                            </li>
                            <li className="text-gray-500 dark:text-gray-400">/</li>
                            <li className="text-primary">Dashboard</li>
                        </ol>
                    </nav>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Welcome back, <span className="font-medium text-black dark:text-white">{user.firstName + " " + user.lastName || 'User'}!</span>
                </div>
            </div>

            {/* Stats Grid - Using reusable StatsCard component */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statsConfig.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* Monthly Donations Chart - 2/3 width */}
                <ChartCard
                    title="Monthly Donations"
                    subtitle="Donation trends over the past year"
                    className="lg:col-span-2"
                >
                    <BarChartOne data={statistics.donations.monthlyTrend} />
                </ChartCard>

                {/* Donation Status - 1/3 width */}
                <ChartCard
                    title="Donation Status"
                    subtitle="Current donation breakdown"
                >
                    <div className="space-y-6">
                        {/* Status Distribution */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Approved</span>
                                <span className="text-sm font-semibold text-success">{statistics.donations.approvedDonations}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                <div
                                    className="bg-success h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(statistics.donations.approvedDonations / statistics.donations.totalDonations) * 100}%` }}
                                ></div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
                                <span className="text-sm font-semibold text-warning">{statistics.donations.pendingDonations}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                <div
                                    className="bg-warning h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(statistics.donations.pendingDonations / statistics.donations.totalDonations) * 100}%` }}
                                ></div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Rejected</span>
                                <span className="text-sm font-semibold text-danger">{statistics.donations.rejectedDonations}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                <div
                                    className="bg-danger h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(statistics.donations.rejectedDonations / statistics.donations.totalDonations) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="pt-4 border-t border-stroke dark:border-strokedark">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Items</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                        {statistics.donations.totalItemsDonated.toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Change</p>
                                    <p className={`text-lg font-bold ${statistics.donations.percentageChange >= 0 ? 'text-success' : 'text-danger'}`}>
                                        {statistics.donations.percentageChange >= 0 ? '+' : ''}{statistics.donations.percentageChange}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </ChartCard>
            </div>

            {/* Waste Statistics Section */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Waste Distribution Donut Chart */}
                <ChartCard
                    title="Waste Distribution"
                    subtitle={`Top reason: ${statistics.waste.topWasteReason}`}
                >
                    <WasteDonutChart wasteStats={statistics.waste} />

                    {/* Waste Metrics */}
                    <div className="mt-4 pt-4 border-t border-stroke dark:border-strokedark">
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-center">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Records</p>
                                <p className="text-base font-bold text-gray-900 dark:text-white">
                                    {statistics.waste.totalWasteRecords}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Quantity</p>
                                <p className="text-base font-bold text-danger">
                                    {statistics.waste.totalQuantityWasted} kg
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Change</p>
                                <p className={`text-base font-bold ${statistics.waste.percentageChange >= 0 ? 'text-danger' : 'text-success'}`}>
                                    {statistics.waste.percentageChange >= 0 ? '+' : ''}{statistics.waste.percentageChange}%
                                </p>
                            </div>
                        </div>
                    </div>
                </ChartCard>

                {/* Waste Reasons Bar Chart */}
                <ChartCard
                    title="Waste Reasons"
                    subtitle="Distribution of waste by reason"
                >
                    <WasteReasonChart
                        topReason={statistics.waste.topWasteReason}
                        totalRecords={statistics.waste.totalWasteRecords}
                    />

                    {/* Prevention Tips */}
                    <div className="mt-4 p-4 bg-warning/10 border border-warning rounded-lg">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-warning mb-1">Waste Prevention Tip</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Monitor expiration dates closely. The common waste reason is {statistics.waste.topWasteReason.toLowerCase()}.
                                </p>
                            </div>
                        </div>
                    </div>
                </ChartCard>
            </div>

            {/* Statistics Chart */}
            <ChartCard
                title="Donation Trends"
                subtitle="Items donated over time"
            >
                <LineChartOne data={statistics.donations.monthlyTrend} />
            </ChartCard>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
               
                <ChartCard title="Recent Activities" subtitle="Latest system activities">
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {statistics.recentActivities && statistics.recentActivities.length > 0 ? (
                            statistics.recentActivities.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-meta-4/50 hover:bg-gray-100 dark:hover:bg-meta-4 transition-colors"
                                >
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${activity.activityType === 'Donation'
                                            ? 'bg-blue-100 dark:bg-blue-500/10'
                                            : 'bg-purple-100 dark:bg-purple-500/10'
                                        }`}>
                                        {activity.activityType === 'Donation' ? (
                                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 dark:text-white truncate">
                                            {activity.description}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {activity.performedBy}
                                            </p>
                                            <span className="text-gray-400">•</span>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(activity.activityDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`flex-shrink-0 inline-block px-2 py-1 text-xs rounded-full ${activity.status === 'Approved' || activity.status === 'Available'
                                            ? 'bg-success/10 text-success'
                                            : activity.status === 'Pending'
                                                ? 'bg-warning/10 text-warning'
                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                        }`}>
                                        {activity.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-8">No recent activities</p>
                        )}
                    </div>
                </ChartCard>

                {/* Top Donors */}
                <ChartCard title="Top Donors" subtitle="Most active donors">
                    <div className="space-y-3">
                        {statistics.donors.topDonors && statistics.donors.topDonors.length > 0 ? (
                            statistics.donors.topDonors.map((donor, index) => (
                                <div
                                    key={donor.donorId}
                                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-meta-4/50 hover:bg-gray-100 dark:hover:bg-meta-4 transition-colors"
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-primary font-bold">#{index + 1}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 dark:text-white truncate">
                                                {donor.donorName}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {donor.totalDonations} donations
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {donor.totalItems.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">items</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-8">No donor data available</p>
                        )}
                    </div>
                </ChartCard>
            </div>
        </div>
    );
}

export default Dashboard;
