import { useSidebar } from '../contexts/SidebarContext';

const Backdrop = () => {
  const { isMobileOpen, closeMobile } = useSidebar();

  if (!isMobileOpen) return null;

  return (
    <div
      className="fixed inset-0 z-9998 bg-black bg-opacity-50 lg:hidden"
      onClick={closeMobile}
      aria-hidden="true"
    />
  );
};

export default Backdrop;
