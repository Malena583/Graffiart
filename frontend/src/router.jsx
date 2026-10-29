import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { ROLES } from "./constants/APP";
import { ROUTES } from "./constants/ROUTES";
import Layout from "./components/Layout/Layout";
import AdminLayout from "./components/AdminLayout/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import {Admin, AdminAccesorios, AdminCategorias, AdminProductos, Carrito, Configurator, Home, Inventario, Login, Perfil, ProductoDetalle, Productos, Register, AdminPedidos
} from "./pages";

export const router = createBrowserRouter([
  // Panel admin: layout propio, SIN el Navbar/Footer públicos
  {
    element: <ProtectedRoute role={ROLES.admin} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: ROUTES.admin, element: <Admin /> },
          { path: ROUTES.adminCategories, element: <AdminCategorias /> },
          { path: ROUTES.adminProducts, element: <AdminProductos /> },
          { path: ROUTES.inventory, element: <Inventario /> },
          { path: ROUTES.adminDesigns, element: <Outlet /> },
          { path: ROUTES.adminSizes, element: <Outlet /> },
          { path: ROUTES.adminColors, element: <Outlet /> },
          { path: ROUTES.adminMaterials, element: <Outlet /> },
          { path: ROUTES.adminAccessories, element: <AdminAccesorios /> },
          { path: ROUTES.adminOrders, element: <AdminPedidos /> },
        ],
      },
    ],
  },

  
  // Sitio público
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: ROUTES.configurator, element: <Configurator /> },
      { path: ROUTES.products, element: <Productos /> },
      { path: ROUTES.productDetailPattern, element: <ProductoDetalle /> },
      { path: ROUTES.cart, element: <Carrito /> },

      { path: ROUTES.login, element: <Login /> },
      { path: ROUTES.register, element: <Register /> },
      { path: ROUTES.forgotPassword, element: <Login /> },
      { path: ROUTES.resetPassword, element: <Login /> },

      {
        element: <ProtectedRoute />,
        children: [{ path: ROUTES.profile, element: <Perfil /> }],
      },

      { path: "*", element: <Navigate to={ROUTES.home} replace /> },
    ],
  },
]);