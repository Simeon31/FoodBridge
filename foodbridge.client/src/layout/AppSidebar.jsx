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
          <path d="M10 7.5C8.61929 7.5 7.5 8.61929 7.5 10H9.16667C9.16667 9.54024 9.54024 9.16667 10 9.16667C10.4598 9.16667 10.8333 9.54024 10.8333 10C10.8333 10.4598 10.4598 10.8333 10 10.8333H9.16667V12.5H10C10.9205 12.5 11.6667 11.7538 11.6667 10.8333C11.6667 10.2609 11.3683 9.7599 10.9205 9.46953C11.5482 9.16667 12.0833 8.66667 12.0833 7.91667C12.0833 6.99619 11.3371 6.25 10.4167 6.25H9.58333V7.91667H10.4167C10.4167 7.91667 10.4167 7.91667 10.4167 7.91667C10.4167 8.37643 10.0431 8.75 9.58333 8.75V10.4167C10.5038 10.4167 11.25 11.1629 11.25 12.0833C11.25 13.0038 10.5038 13.75 9.58333 13.75H9.16667V15.4167H10C11.3807 15.4167 12.5 14.2974 12.5 12.9167C12.5 11.536 11.3807 10.4167 10 10.4167C9.08 10.4167 8.33333 9.67 8.33333 8.75C8.33333 7.83 9.08 7.08333 10 7.08333V5.41667C8.16193 5.41667 6.66667 6.91193 6.66667 8.75C6.66667 10.5881 8.16193 12.0833 10 12.0833C10.92 12.0833 11.6667 12.83 11.6667 13.75C11.6667 14.67 10.92 15.4167 10 15.4167V17.0833C11.838 17.0833 13.3333 15.5881 13.3333 13.75C13.3333 11.912 11.838 10.4167 10 10.4167Z" />
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
   <path d="M16.6667 3.33333H3.33333C2.41286 3.33333 1.66667 4.07953 1.66667 5V15C1.66667 15.9205 2.41286 16.6667 3.33333 16.6667H16.6667C17.5871 16.6667 18.3333 15.9205 18.3333 15V5C18.3333 4.07953 17.5871 3.33333 16.6667 3.33333Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M10 11.6667C11.3807 11.6667 12.5 10.5474 12.5 9.16667C12.5 7.78595 11.3807 6.66667 10 6.66667C8.61929 6.66667 7.5 7.78595 7.5 9.16667C7.5 10.5474 8.61929 11.6667 10 11.6667Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 15C5 13.1591 7.23858 11.6667 10 11.6667C12.7614 11.6667 15 13.1591 15 15" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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

  const sidebarClasses = `
    fixed left-0 top-0 z-9999 flex h-screen flex-col overflow-y-auto bg-boxdark duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0
  ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
    ${isExpanded || isHovered ? 'w-72.5' : 'w-20'}
  `;

  return (
    <>
      <aside
className={sidebarClasses}
  onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
      {/* Logo */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
              FB
      </div>
 {(isExpanded || isHovered) && (
     <span className="text-xl font-bold text-white">FoodBridge</span>
 )}
          </Link>

{/* Toggle Button for Desktop */}
          <button
        onClick={toggleExpanded}
            className="hidden lg:block text-white hover:text-primary"
 aria-label="Toggle Sidebar"
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
d="M12.5 3.33334L7.5 10L12.5 16.6667L13.8333 15.5L9.83333 10L13.8333 4.5L12.5 3.33334Z"
                fill=""
     />
 </svg>
   </button>

     {/* Close Button for Mobile */}
      <button
          onClick={closeMobile}
            className="block lg:hidden text-white"
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
     fill=""
        />
       </svg>
          </button>
 </div>

        {/* Navigation */}
  <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          <div>
      <h3 className={`mb-4 ml-4 text-sm font-semibold text-bodydark2 ${!(isExpanded || isHovered) && 'hidden'}`}>
           MENU
    </h3>

 <ul className="mb-6 flex flex-col gap-1.5">
    {menuItems.map((item) => (
        <li key={item.path}>
            <Link
     to={item.path}
   onClick={() => closeMobile()}
    className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out ${
       isActive(item.path)
        ? 'bg-graydark text-white'
        : 'text-bodydark1 hover:bg-graydark hover:text-white'
    }`}
         >
         <span className={`${!(isExpanded || isHovered) && 'mx-auto'}`}>
            {item.icon}
          </span>
           {(isExpanded || isHovered) && item.title}
      </Link>
   </li>
     ))}
        </ul>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default AppSidebar;
