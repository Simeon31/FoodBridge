import { useAuth } from '../contexts/AuthContext';
import StatsCard from '../components/dashboard/StatsCard';
import ChartCard from '../components/dashboard/ChartCard';
import BarChartOne from '../components/charts/BarChartOne';
import LineChartOne from '../components/charts/LineChartOne';
import CircularProgress from '../components/charts/CircularProgress';

function Dashboard() {
  const { user } = useAuth();

  // Stats configuration - DRY principle
  const statsConfig = [
    {
  title: 'Total Donations',
      value: '3,782',
   change: '+11.01%',
      isPositive: true,
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
      title: 'Active Requests',
      value: '5,359',
      change: '-9.05%',
      isPositive: false,
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
      title: 'Organizations',
      value: '156',
      change: '+4.18%',
      isPositive: true,
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
      title: 'Growth Rate',
      value: '+24.5%',
change: '+1.2%',
      isPositive: true,
  bgColor: 'bg-orange-100',
  darkBgColor: 'dark:bg-orange-500/10',
      iconColor: 'text-orange-600 dark:text-orange-400',
    icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
</svg>
      ),
    },
  ];

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
    Welcome back, <span className="font-medium text-black dark:text-white">{user?.email || 'User'}!</span>
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
        {/* Monthly Sales Chart - 2/3 width */}
        <ChartCard
          title="Monthly Sales"
          subtitle="Donation trends over the past year"
          className="lg:col-span-2"
 tabs={[
            { label: 'Overview', active: true, onClick: () => {} },
    { label: 'Sales', active: false, onClick: () => {} },
      { label: 'Revenue', active: false, onClick: () => {} },
          ]}
   >
          <BarChartOne />
        </ChartCard>

        {/* Monthly Target - 1/3 width */}
    <ChartCard
       title="Monthly Target"
       subtitle="Progress towards monthly goal"
      actions={
  <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
  </svg>
       </button>
 }
        >
       <CircularProgress percentage={75.55} />
          
      {/* Success Message */}
    <div className="mt-4 text-center">
<p className="text-sm text-success font-medium mb-1">+10% increase</p>
         <p className="text-xs text-gray-500 dark:text-gray-400">
              You earned $3,287 today. That's higher than last month. Keep up the good work!
            </p>
   </div>

   {/* Metrics Grid */}
    <div className="mt-6 grid grid-cols-3 gap-4 border-t border-stroke dark:border-strokedark pt-4">
      <div className="text-center">
           <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Target</p>
  <p className="text-lg font-bold text-gray-900 dark:text-white flex items-center justify-center gap-1">
        $20K
                <svg className="w-4 h-4 text-danger" fill="currentColor" viewBox="0 0 20 20">
     <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
   </svg>
       </p>
     </div>
       <div className="text-center">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Revenue</p>
  <p className="text-lg font-bold text-gray-900 dark:text-white flex items-center justify-center gap-1">
   $20K
      <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
       <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
  </p>
   </div>
            <div className="text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Today</p>
         <p className="text-lg font-bold text-gray-900 dark:text-white flex items-center justify-center gap-1">
            $20K
    <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
       <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
       </svg>
      </p>
     </div>
          </div>
        </ChartCard>
      </div>

      {/* Statistics Chart - Full Width */}
      <ChartCard
        title="Statistics"
     subtitle="Donations and requests trends"
        tabs={[
          { label: 'Overview', active: true, onClick: () => {} },
  { label: 'Donations', active: false, onClick: () => {} },
    { label: 'Requests', active: false, onClick: () => {} },
        ]}
        actions={
       <button className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-meta-4 dark:text-white dark:hover:bg-meta-4/80">
   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
    <span>Nov 2, 2025 - Nov 8, 2025</span>
          </button>
        }
      >
        <LineChartOne />
      </ChartCard>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Recent Donations */}
   <ChartCard title="Recent Donations" subtitle="Latest donation activities">
          <div className="space-y-3">
{[
              { donor: 'ABC Restaurant', amount: '150 kg', time: '2 hours ago', status: 'Approved' },
 { donor: 'Local Farm', amount: '80 kg', time: '5 hours ago', status: 'Pending' },
              { donor: 'Supermarket XYZ', amount: '200 kg', time: '1 day ago', status: 'Approved' },
            ].map((donation, index) => (
<div
     key={index}
  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-meta-4/50 hover:bg-gray-100 dark:hover:bg-meta-4 transition-colors"
        >
   <div className="flex-1">
         <p className="font-medium text-gray-900 dark:text-white">{donation.donor}</p>
             <p className="text-sm text-gray-500 dark:text-gray-400">{donation.time}</p>
              </div>
       <div className="text-right">
          <p className="font-semibold text-gray-900 dark:text-white">{donation.amount}</p>
 <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                 donation.status === 'Approved' 
  ? 'bg-success/10 text-success' 
         : 'bg-warning/10 text-warning'
         }`}>
     {donation.status}
           </span>
      </div>
        </div>
         ))}
          </div>
        </ChartCard>

        {/* Recent Requests */}
        <ChartCard title="Recent Requests" subtitle="Latest pickup requests">
  <div className="space-y-3">
            {[
   { org: 'Food Bank Central', items: '3 items', time: '1 hour ago', status: 'In Progress' },
         { org: 'Community Kitchen', items: '5 items', time: '3 hours ago', status: 'Completed' },
   { org: 'Shelter Home', items: '2 items', time: '6 hours ago', status: 'Completed' },
     ].map((request, index) => (
  <div
    key={index}
          className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-meta-4/50 hover:bg-gray-100 dark:hover:bg-meta-4 transition-colors"
   >
         <div className="flex-1">
           <p className="font-medium text-gray-900 dark:text-white">{request.org}</p>
  <p className="text-sm text-gray-500 dark:text-gray-400">{request.time}</p>
                </div>
  <div className="text-right">
       <p className="font-semibold text-gray-900 dark:text-white">{request.items}</p>
         <span className={`inline-block px-2 py-1 text-xs rounded-full ${
        request.status === 'Completed' 
       ? 'bg-success/10 text-success' 
         : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
       }`}>
  {request.status}
  </span>
    </div>
</div>
          ))}
          </div>
      </ChartCard>
      </div>
    </div>
  );
}

export default Dashboard;
