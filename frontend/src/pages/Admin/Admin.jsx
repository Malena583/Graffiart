import { Link } from "react-router";
import { ADMIN_CARDS } from "../../constants/ADMIN_CARDS";
import { MESSAGES } from "../../constants/MESSAGES";

const A = MESSAGES.admin;

const AdminCard = ({ to, title, children }) => {
  return (
    <Link
      to={to}
      className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <h2 className="mb-2 text-lg font-semibold text-neutral-900">{title}</h2>
      <p className="text-sm text-neutral-600">{children}</p>
    </Link>
  );
};

const Admin = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-neutral-900">{A.title}</h1>
        <p className="mt-1 text-sm text-neutral-500">{A.subtitle}</p>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        {ADMIN_CARDS.map(({ to, title, text }) => (
          <AdminCard key={to} to={to} title={title}>
            {text}
          </AdminCard>
        ))}
      </div>
    </div>
  );
};

export default Admin;
