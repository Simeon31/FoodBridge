import { useAuth } from '../contexts/AuthContext';
import BarChartOne from '../components/charts/BarChartOne';
import LineChartOne from '../components/charts/LineChartOne';
import CircularProgress from '../components/charts/CircularProgress';

function Dashboard() {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Customers',
      value: '3,782',
      change: '+11.01%',
   isPositive: true,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
      ),
    },
    {
      title: 'Orders',
      value: '5,359',
      change: '-9.05%',
      isPositive: false,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
     </svg>
      ),
    },
    {
    title: 'Revenue',
      value: '$45,2K',
      change: '+4.18%',
      isPositive: true,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Growth',
      value: '+2.5%',
      change: '+1.2%',
      isPositive: true,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
   <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
      </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
          Welcome back, {user?.email || 'User'}!
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
         key={index}
   className="bg-white dark:bg-boxdark rounded-lg border border-stroke dark:border-strokedark p-6 shadow-card hover:shadow-lg transition-shadow"
          >
       <div className="flex items-center justify-between">
  <div className="flex items-center gap-4">
     <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-meta-4 text-primary">
     {stat.icon}
      </div>
            <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
        <h4 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
             {stat.value}
       </h4>
          </div>
     </div>
         </div>
            <div className="mt-4 flex items-center gap-2">
           <span
        className={`inline-flex items-center gap-1 text-sm font-medium ${
        stat.isPositive ? 'text-success' : 'text-danger'
   }`}
 >
          {stat.isPositive ? (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
           <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
         ) : (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
       <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
      )}
        {stat.change}
</span>
 </div>
 </div>
        ))}
 </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
   {/* Monthly Sales Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-boxdark rounded-lg border border-stroke dark:border-strokedark p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
  Monthly Sales
 </h3>
      <div className="flex gap-2">
              <button className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
        Overview
    </button>
              <button className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
   Sales
              </button>
      <button className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
 Revenue
           </button>
        </div>
          </div>
          <BarChartOne />
 </div>

        {/* Monthly Target */}
        <div className="bg-white dark:bg-boxdark rounded-lg border border-stroke dark:border-strokedark p-6 shadow-card">
 <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
      Monthly Target
   </h3>
         <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Target you've set for each month
          </p>
  <CircularProgress percentage={75.55} />
          <div className="mt-4 text-center">
            <p className="text-sm text-success font-medium">+10%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
You earn $3287 today, it's higher than last month. Keep up your good work!
      </p>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-stroke dark:border-strokedark pt-4">
       <div className="text-center">
  <p className="text-xs text-gray-500 dark:text-gray-400">Target</p>
       <p className="text-lg font-bold text-gray-900 dark:text-white flex items-center justify-center gap-1">
 $20K
        <svg className="w-4 h-4 text-danger" fill="currentColor" viewBox="0 0 20 20">
             <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
       </p>
         </div>
            <div className="text-center">
   <p className="text-xs text-gray-500 dark:text-gray-400">Revenue</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white flex items-center justify-center gap-1">
         $20K
       <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
         </p>
 </div>
            <div className="text-center">
      <p className="text-xs text-gray-500 dark:text-gray-400">Today</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white flex items-center justify-center gap-1">
        $20K
         <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
   <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
     </svg>
              </p>
</div>
          </div>
        </div>
      </div>

   {/* Statistics Chart */}
      <div className="bg-white dark:bg-boxdark rounded-lg border border-stroke dark:border-strokedark p-6 shadow-card">
   <div className="mb-4 flex items-center justify-between">
       <div>
   <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
      Statistics
          </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
           Target you've set for each month
            </p>
          </div>
          <div className="flex gap-4">
            <button className="text-sm font-medium text-gray-900 dark:text-white border-b-2 border-primary pb-2">
       Overview
</button>
            <button className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 pb-2">
        Sales
            </button>
            <button className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 pb-2">
     Revenue
            </button>
          </div>
        </div>
        <LineChartOne />
      </div>
    </div>
  );
}

export default Dashboard;
