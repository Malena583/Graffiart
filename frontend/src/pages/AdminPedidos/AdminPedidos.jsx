import AdminPage from "../../components/AdminPage/AdminPage";
import { ADMIN_MESSAGES } from "../../constants/ADMIN_MESSAGE";

const AdminPedidos = () => {
  return (
    <AdminPage
      title={ADMIN_MESSAGES.orders.title}
      subtitle={ADMIN_MESSAGES.orders.subtitle}
    />
  );
};

export default AdminPedidos;