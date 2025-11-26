import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../contexts/SidebarContext';

const AppSidebar = () => {
  const location = useLocation();
  const { isExpanded, isHovered, isMobileOpen, setIsHovered, toggleExpanded, closeMobile } = useSidebar();

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
   <path d="M8.33333 5.83333H2.5V2.5H8.33333V5.83333ZM8.33333 17.5H2.5V7.5H8.33333V17.5ZM17.5 17.5H11.6667V14.1667H17.5V17.5ZM17.5 12.5H11.6667V2.5H17.5V12.5Z" />
        </svg>
      ),
    },
    {
      title: 'Donations',
 path: '/donations',
   icon: (
        <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
     <path d="M10 3.33334C5.39763 3.33334 1.66667 7.0643 1.66667 11.6667C1.66667 16.269 5.39763 20 10 20C14.6024 20 18.3333 16.269 18.3333 11.6667C18.3333 7.0643 14.6024 3.33334 10 3.33334ZM10 18.3333C6.31572 18.3333 3.33333 15.351 3.33333 11.6667C3.33333 7.98239 6.31572 5.00001 10 5.00001C13.6843 5.00001 16.6667 7.98239 16.6667 11.6667C16.6667 15.351 13.6843 18.3333 10 18.3333Z" />
        </svg>
      ),
    },
    {
      title: 'Requests',
      path: '/requests',
      icon: (
      <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.5 2.5H2.5C1.58 2.5 0.833333 3.24667 0.833333 4.16667V15.8333C0.833333 16.7533 1.58 17.5 2.5 17.5H17.5C18.42 17.5 19.1667 16.7533 19.1667 15.8333V4.16667C19.1667 3.24667 18.42 2.5 17.5 2.5ZM17.5 15.8333H2.5V10H17.5V15.8333ZM17.5 6.66667H2.5V4.16667H17.5V6.66667Z" />
     </svg>
      ),
    },
    {
      title: 'Organizations',
      path: '/organizations',
      icon: (
        <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
     <path d="M16.6667 3.33333H3.33333C2.41286 3.33333 1.66667 4.07953 1.66667 5V15C1.66667 15.9205 2.41286 16.6667 3.33333 16.6667H16.6667C17.5871 16.6667 18.3333 15.9205 18.3333 15V5C18.3333 4.07953 17.5871 3.33333 16.6667 3.33333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 11.6667C11.3807 11.6667 12.5 10.5474 12.5 9.16667C12.5 7.78595 11.3807 6.66667 10 6.66667C8.61929 6.66667 7.5 7.78595 7.5 9.16667C7.5 10.5474 8.61929 11.6667 10 11.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
 <path d="M5 15C5 13.1591 7.23858 11.6667 10 11.6667C12.7614 11.6667 15 13.1591 15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: 'Profile',
      path: '/profile',
      icon: (
        <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 3C11.66 3 13 4.34 13 6C13 7.66 11.66 9 10 9C8.34 9 7 7.66 7 6C7 4.34 8.34 3 10 3ZM10 17.2C7.5 17.2 5.29 15.92 4 13.98C4.03 11.99 8 10.9 10 10.9C11.99 10.9 15.97 11.99 16 13.98C14.71 15.92 12.5 17.2 10 17.2Z" />
        </svg>
      ),
    },
  ];

  const isActive = (path) => location.pathname === path;

  // Determine sidebar width based on state
  const getSidebarWidth = () => {
    // Mobile: full width when open
    if (isMobileOpen) return 'w-72.5';
    // Desktop: expanded or hovered
    if (isExpanded || isHovered) return 'w-72.5';
    // Desktop: collapsed
    return 'w-20';
  };

  return (
    <aside
   className={`
        fixed left-0 top-0 z-9999 h-screen
        flex flex-col overflow-y-hidden
        bg-boxdark dark:bg-boxdark
        transition-all duration-300 ease-in-out
      lg:static lg:h-screen
        ${getSidebarWidth()}
      ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
      onMouseEnter={() => !isMobileOpen && setIsHovered(true)}
      onMouseLeave={() => !isMobileOpen && setIsHovered(false)}
    >
      {/* Header Section */}
   <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 border-b border-strokedark">
        <Link to="/dashboard" className="flex items-center gap-3" onClick={closeMobile}>
          {/* Logo */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold text-xl shrink-0">
         FB
          </div>
          
          {/* Brand Name */}
          <span 
            className={`
     text-xl font-bold text-white whitespace-nowrap
  transition-all duration-300
         ${(isExpanded || isHovered || isMobileOpen) ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}
   `}
          >
  FoodBridge
        </span>
        </Link>

      {/* Close Button for Mobile */}
        <button
   onClick={closeMobile}
  className="block lg:hidden text-bodydark1 hover:text-danger transition-colors"
          aria-label="Close Sidebar"
  >
          <svg
     className="fill-current"
    width="20"
            height="20"
   viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
  >
            <path
        fillRule="evenodd"
   clipRule="evenodd"
              d="M4.29289 4.29289C4.68342 3.90237 5.31658 3.90237 5.70711 4.29289L10 8.58579L14.2929 4.29289C14.6834 3.90237 15.3166 3.90237 15.7071 4.29289C16.0976 4.68342 16.0976 5.31658 15.7071 5.70711L11.4142 10L15.7071 14.2929C16.0976 14.6834 16.0976 15.3166 15.7071 15.7071C15.3166 16.0976 14.6834 16.0976 14.2929 15.7071L10 11.4142L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L8.58579 10L4.29289 5.70711C3.90237 5.31658 3.90237 4.68342 4.29289 4.29289Z"
            />
          </svg>
        </button>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 overflow-y-auto py-4 px-4 lg:px-6 custom-scrollbar">
      {/* Menu Section Title */}
      <h3 
  className={`
            mb-4 ml-4 text-sm font-semibold text-bodydark2 uppercase tracking-wider
         transition-all duration-300
            ${(isExpanded || isHovered || isMobileOpen) ? 'opacity-100' : 'opacity-0 h-0 mb-0'}
          `}
   >
          MENU
        </h3>

    {/* Menu Items */}
        <ul className="flex flex-col gap-1.5">
       {menuItems.map((item) => (
<li key={item.path}>
              <Link
 to={item.path}
    onClick={closeMobile}
       className={`
        group relative flex items-center gap-2.5 rounded-lg px-4 py-3
      font-medium transition-all duration-200
      ${isActive(item.path)
     ? 'bg-graydark text-white'
   : 'text-bodydark1 hover:bg-graydark/50 hover:text-white'
        }
     ${!(isExpanded || isHovered || isMobileOpen) && 'justify-center'}
         `}
  title={!(isExpanded || isHovered || isMobileOpen) ? item.title : ''}
    >
    {/* Icon */}
     <span className="flex items-center justify-center shrink-0">
      {item.icon}
     </span>

        {/* Title */}
           <span 
      className={`
             whitespace-nowrap transition-all duration-300
    ${(isExpanded || isHovered || isMobileOpen) ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}
          `}
     >
          {item.title}
      </span>

                {/* Active Indicator */}
        {isActive(item.path) && (
               <span className="absolute right-2 h-2 w-2 rounded-full bg-primary" />
         )}
   </Link>
  </li>
          ))}
        </ul>
      </nav>

{/* Footer Section (Optional) */}
      <div className="border-t border-strokedark p-4">
        <div 
          className={`
       flex items-center gap-3
            ${!(isExpanded || isHovered || isMobileOpen) && 'justify-center'}
          `}
        >
       <div className="flex h-10 w-10 items-center justify-center rounded-full bg-meta-4 shrink-0">
      <svg className="fill-current text-bodydark1" width="18" height="18" viewBox="0 0 18 18" fill="none">
<path d="M9 0.75C4.44375 0.75 0.75 4.44375 0.75 9C0.75 13.5563 4.44375 17.25 9 17.25C13.5563 17.25 17.25 13.5563 17.25 9C17.25 4.44375 13.5563 0.75 9 0.75ZM9 15.75C5.26875 15.75 2.25 12.7313 2.25 9C2.25 5.26875 5.26875 2.25 9 2.25C12.7313 2.25 15.75 5.26875 15.75 9C15.75 12.7313 12.7313 15.75 9 15.75Z" />
    <path d="M9 4.5C8.58579 4.5 8.25 4.83579 8.25 5.25V9C8.25 9.41421 8.58579 9.75 9 9.75C9.41421 9.75 9.75 9.41421 9.75 9V5.25C9.75 4.83579 9.41421 4.5 9 4.5Z" />
         <path d="M9 11.25C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75C9.41421 12.75 9.75 12.4142 9.75 12C9.75 11.5858 9.41421 11.25 9 11.25Z" />
            </svg>
          </div>
          <span 
            className={`
       text-xs text-bodydark1 transition-all duration-300
       ${(isExpanded || isHovered || isMobileOpen) ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}
       `}
          >
      v1.0.0
          </span>
    </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
