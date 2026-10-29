
import { MESSAGES } from "../../constants/MESSAGES";

const A = MESSAGES.admin;

const Admin = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-neutral-900">
          {A.title}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {A.subtitle}
        </p>
      </header>
    </div>
  );
};

export default Admin;

