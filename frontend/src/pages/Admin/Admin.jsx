import { Link } from "react-router";
import { Menu } from "lucide-react";
import { ADMIN_NAV } from "../../constants/ADMIN_NAV";
import { MESSAGES } from "../../constants/MESSAGES";

const A = MESSAGES.admin;

const CARD_CLASS =
  "group flex h-full flex-col items-center rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm transition duration-200 hover:-translate-y-1.5 hover:scale-[1.03] hover:border-neutral-900 hover:shadow-xl focus-visible:-translate-y-1.5 focus-visible:outline-2 focus-visible:outline-neutral-900";

// Ícono, título y descripción de un cuadrado.
const CardContent = ({ item }) => {
  const Icon = item.icon;

  return (
    <>
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900 text-white transition duration-200 group-hover:scale-110">
        <Icon size={24} aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-neutral-900">{item.label}</h2>
      <p className="mt-1 text-sm text-neutral-500">{item.text}</p>
    </>
  );
};

const Admin = () => {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col items-center justify-center px-6 py-12">
      <header className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          {A.title}
        </h1>
        <p className="mt-3 text-neutral-500">{A.subtitle}</p>
        <p className="mt-4 inline-flex flex-wrap items-center justify-center gap-2 text-sm text-neutral-500">
        </p>
      </header>

      <div className="mt-10 grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ADMIN_NAV.map((item) =>
          item.children ? (
            // Productos tiene dos vistas: cada botoncito lleva a la suya
            <div key={item.id} className={CARD_CLASS}>
              <CardContent item={item} />
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {item.children.map((child) => (
                  <Link
                    key={child.to}
                    to={child.to}
                    className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-900 hover:text-white"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link key={item.id} to={item.to} className={CARD_CLASS}>
              <CardContent item={item} />
            </Link>
          ),
        )}
      </div>
    </div>
  );
};

export default Admin;