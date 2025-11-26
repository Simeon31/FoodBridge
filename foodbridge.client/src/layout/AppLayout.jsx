import { Outlet } from 'react-router-dom';
import { SidebarProvider, useSidebar } from '../contexts/SidebarContext';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import Backdrop from './Backdrop';

const LayoutContent = () => {
  const { isMobileOpen } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <AppSidebar />
      
      {/* Backdrop for mobile */}
      <Backdrop />

      {/* Main Content Area */}
    <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <AppHeader />

        {/* Main Content */}
    <main className="flex-grow">
       <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            <Outlet />
          </div>
        </main>
</div>
    </div>
  );
};

const AppLayout = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
