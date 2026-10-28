import { Camera, Truck, UsersRound } from "lucide-react";
import { Link, useLocation } from "react-router";
import { FOOTER } from "../../constants/FOOTER";
import { ROUTES } from "../../constants/ROUTES";
import GraffiartLink from "../GraffiartLink/GraffiartLink";

// Pie de página con links útiles, redes y datos de envío. No se muestra en login ni registro.
const Footer = () => {
  const location = useLocation();
  const isLoginOrRegister = [ROUTES.login, ROUTES.register].includes(
    location.pathname,
  );

  if (isLoginOrRegister) return null;

  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="px-6 py-8 sm:px-10 lg:px-16">
        <div className="flex flex-col gap-4 border-b border-neutral-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <GraffiartLink className="text-xl font-bold text-neutral-900" />
            <p className="mt-2 text-sm text-neutral-500">
              {FOOTER.description}
            </p>
          </div>

          <div className="flex gap-4 text-neutral-700">
            <a
              href={FOOTER.social.instagramUrl}
              aria-label={FOOTER.social.instagram}
              className="transition hover:text-neutral-950"
            >
              <Camera size={22} />
            </a>
            <a
              href={FOOTER.social.facebookUrl}
              aria-label={FOOTER.social.facebook}
              className="transition hover:text-neutral-950"
            >
              <UsersRound size={22} />
            </a>
          </div>
        </div>

        <div className="grid gap-8 border-b border-neutral-200 py-6 sm:grid-cols-3">
          <section>
            <h2 className="text-sm font-semibold text-neutral-900">
              {FOOTER.store.title}
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600">
              {FOOTER.storeLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link className="hover:text-neutral-900" to={to}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-neutral-900">
              {FOOTER.help.title}
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600">
              {FOOTER.helpLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link className="hover:text-neutral-900" to={to}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex items-start gap-3">
            <Truck size={22} className="mt-0.5 shrink-0 text-neutral-500" />
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">
                {FOOTER.shipping.title}
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                {FOOTER.shipping.description}
              </p>
            </div>
          </section>
        </div>

        <p className="pt-5 text-left text-sm text-neutral-500">
          © {new Date().getFullYear()} {FOOTER.copyright}
        </p>
      </div>
    </footer>
  );
};

export default Footer;