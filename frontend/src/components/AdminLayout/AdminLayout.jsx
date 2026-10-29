//frontend/src/components/AdminLayout/AdminLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router";
import AdminSidebar from "./AdminSidebar";
import AdminTopNavbar from "./AdminTopNavbar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopNavbar onMenuClick={toggleSidebar} />

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default AdminLayout;