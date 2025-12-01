import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSidebar } from '../contexts/SidebarContext';

const AppHeader = () => {
  const { user, logout } = useAuth();
  const { toggleMobile } = useSidebar();
  const navigate = useNavigate();

  const handleLogout = () => {
  logout();
navigate('/login');
  };

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white shadow-2 dark:bg-boxdark dark:shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
        <button
            onClick={toggleMobile}
   className="block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
   aria-label="Toggle Menu"
          >
            <svg
              className="fill-current"
      width="24"
     height="24"
              viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
         >
              <path
d="M3 6h18M3 12h18M3 18h18"
    stroke="currentColor"
    strokeWidth="2"
   strokeLinecap="round"
              />
  </svg>
          </button>
 </div>

        {/* Logo for Mobile */}
        <Link className="block flex-shrink-0 lg:hidden" to="/dashboard">
        <span className="text-xl font-bold text-primary">FoodBridge</span>
      </Link>

        {/* Search Bar */}
      <div className="hidden sm:block flex-1 max-w-xl mx-4">
     <div className="relative">
          <button className="absolute left-0 top-1/2 -translate-y-1/2 pl-3">
       <svg
    className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
        width="20"
    height="20"
                viewBox="0 0 20 20"
                fill="none"
  xmlns="http://www.w3.org/2000/svg"
       >
      <path
          fillRule="evenodd"
     clipRule="evenodd"
      d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
 fill=""
  />
    <path
  fillRule="evenodd"
         clipRule="evenodd"
            d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
          fill=""
     />
 </svg>
 </button>
            <input
       type="text"
              placeholder="Search..."
          className="w-full bg-transparent pl-10 pr-4 py-2 font-medium focus:outline-none border border-stroke rounded-lg dark:border-strokedark dark:bg-meta-4"
     />
          </div>
      </div>

   {/* Right Side Actions */}
  <div className="flex items-center gap-3 2xsm:gap-7">
          {/* Notifications */}
          <button className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white">
    <svg
          className="fill-current"
      width="18"
           height="18"
          viewBox="0 0 18 18"
        fill="none"
         xmlns="http://www.w3.org/2000/svg"
        >
              <path
         d="M16.1999 14.9343L15.6374 14.0624C15.5249 13.8937 15.4687 13.7249 15.4687 13.528V10.3124C15.4687 6.32808 12.8562 3.05933 9.08741 2.1343C8.97491 1.85933 8.77491 1.61246 8.52491 1.42808C8.20616 1.18746 7.80303 1.04996 7.37178 1.04996C6.94053 1.04996 6.53741 1.18746 6.21866 1.42808C5.96866 1.61246 5.76866 1.85933 5.65616 2.1343C1.88741 3.05933 -0.725098 6.32808 -0.725098 10.3124V13.528C-0.725098 13.7249 -0.78135 13.8937 -0.893848 14.0624L-1.45635 14.9343C-1.65635 15.2437 -1.73135 15.5812 -1.65635 15.9187C-1.58135 16.2562 -1.35635 16.5374 -1.0376 16.7343C-0.691223 16.9593 -0.288723 17.0718 0.140527 17.0718H14.6031C15.0031 17.0718 15.4031 16.9593 15.7781 16.7343C16.0969 16.5374 16.3219 16.2562 16.3969 15.9187C16.4719 15.5812 16.3969 15.2437 16.1969 14.9343H16.1999ZM7.37178 2.54996C7.59991 2.54996 7.82803 2.68746 7.94053 2.90933C7.97803 2.96871 8.01553 3.02808 8.05303 3.08746C7.82803 3.05933 7.60303 3.05933 7.37178 3.05933C7.14053 3.05933 6.91553 3.05933 6.69053 3.08746C6.72803 3.02808 6.76553 2.96871 6.80303 2.90933C6.91553 2.68746 7.14366 2.54996 7.37178 2.54996ZM0.140527 15.5437C0.0843398 15.5437 0.0280898 15.5155 0 15.4874C-0.028085 15.4593 -0.056085 15.403 -0.0279475 15.3468L0.534553 14.4749C0.787428 14.0624 0.899928 13.6218 0.899928 13.1531V10.3124C0.899928 6.66246 3.51553 3.69058 7.06553 3.69058H7.65303C11.2031 3.69058 13.8187 6.66246 13.8187 10.3124V13.1531C13.8187 13.6218 13.9312 14.0624 14.184 14.4749L14.7465 15.3468C14.7747 15.403 14.7747 15.4593 14.7184 15.4874C14.6622 15.5155 14.6059 15.5437 14.5497 15.5437H0.140527Z"
          fill=""
              />
       <path
        d="M7.36836 17.2624C6.62461 17.2624 5.90898 16.9812 5.36836 16.4124C5.11836 16.1593 5.11836 15.7499 5.37148 15.4999C5.62461 15.2499 6.03398 15.2499 6.28398 15.5031C6.57148 15.7937 6.94461 15.9624 7.36836 15.9624C7.79211 15.9624 8.16523 15.7937 8.45273 15.5031C8.70273 15.2499 9.11211 15.2499 9.36523 15.4999C9.61836 15.7499 9.61836 16.1593 9.36836 16.4124C8.82773 16.9812 8.11211 17.2624 7.36836 17.2624Z"
          fill=""
 />
   </svg>
            <span className="absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-meta-1">
        <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
         </span>
      </button>

          {/* User Dropdown */}
          <div className="relative">
            <div className="flex items-center gap-4">
      <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
         {user?.email || 'User'}
      </span>
        <span className="block text-xs">{user?.role || 'Member'}</span>
  </span>

       <span className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </span>

   <button
            onClick={handleLogout}
      className="flex items-center gap-2 rounded-md bg-gray px-3 py-2 text-sm font-medium text-black hover:bg-opacity-90 dark:bg-meta-4 dark:text-white"
    >
      <svg
      className="fill-current"
      width="18"
             height="18"
         viewBox="0 0 18 18"
         fill="none"
   xmlns="http://www.w3.org/2000/svg"
     >
          <path
  d="M12.8 5.4L11.4 6.8L13.6 9H6V11H13.6L11.4 13.2L12.8 14.6L17.4 10L12.8 5.4ZM2 2H10V0H2C0.9 0 0 0.9 0 2V18C0 19.1 0.9 20 2 20H10V18H2V2Z"
        fill=""
          />
    </svg>
        <span className="hidden md:block">Logout</span>
   </button>
    </div>
   </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
