//frontend/src/components/AdminLayout/AdminLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router";
import AdminSidebar from "./AdminSidebar";
import AdminTopNavbar from "./AdminTopNavbar";

// Estructura del panel: barra superior arriba, sidebar a la izquierda y la sección a la derecha.
const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex min-h-screen flex-col bg-neutral-100">
      <AdminTopNavbar onMenuClick={toggleSidebar} />

      <div className="flex flex-1">
        <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        <main className="min-w-0 flex-1">
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