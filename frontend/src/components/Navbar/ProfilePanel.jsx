import { LogOut } from "lucide-react";
import Feedback from "../Feedback/Feedback";
import { MESSAGES } from "../../constants/MESSAGES";
import { usePerfil } from "../../hooks/usePerfil";
import useFetch from "../../hooks/useFetch";
import { listarDisenos } from "../../services/disenoService";

const ProfilePanel = ({ onLogout }) => {
  const { perfil, loading: profileLoading, error: profileError } = usePerfil();
  const {
    data: disenos,
    loading: designsLoading,
    error: designsError,
  } = useFetch(
    "navbar-profile-designs",
    listarDisenos,
    MESSAGES.designs.loadError,
  );

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-neutral-200 bg-white p-4">
        <h3 className="mb-4 text-lg font-semibold text-neutral-900">
          {MESSAGES.profile.title}
        </h3>
        {profileLoading ? (
          <p className="text-sm text-neutral-500">{MESSAGES.profile.loading}</p>
        ) : profileError ? (
          <Feedback type="error">{profileError}</Feedback>
        ) : perfil ? (
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-neutral-500">{MESSAGES.labels.name}</dt>
              <dd className="font-medium text-neutral-900">
                {[perfil.nombre, perfil.apellido].filter(Boolean).join(" ")}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">{MESSAGES.profile.email}</dt>
              <dd className="break-all font-medium text-neutral-900">
                {perfil.email}
              </dd>
            </div>
            {perfil.telefono && (
              <div>
                <dt className="text-neutral-500">{MESSAGES.profile.phone}</dt>
                <dd className="font-medium text-neutral-900">{perfil.telefono}</dd>
              </div>
            )}
            {perfil.rol && (
              <div>
                <dt className="text-neutral-500">{MESSAGES.profile.role}</dt>
                <dd className="font-medium text-neutral-900">{perfil.rol}</dd>
              </div>
            )}
          </dl>
        ) : null}
      </section>

      <section className="rounded-xl border border-neutral-200 bg-white p-4">
        <h3 className="mb-4 text-lg font-semibold text-neutral-900">
          {MESSAGES.profile.designs}
        </h3>
        {designsLoading ? (
          <p className="text-sm text-neutral-500">{MESSAGES.designs.loading}</p>
        ) : designsError ? (
          <Feedback type="error">{designsError}</Feedback>
        ) : disenos?.length ? (
          <ul className="space-y-3">
            {disenos.map((diseno) => (
              <li
                key={diseno.id}
                className="rounded-lg border border-neutral-200 bg-neutral-50 p-3"
              >
                <h4 className="font-semibold text-neutral-900">{diseno.nombre}</h4>
                {diseno.descripcion && (
                  <p className="mt-1 text-sm text-neutral-600">
                    {diseno.descripcion}
                  </p>
                )}
                {diseno.updatedAt && (
                  <p className="mt-2 text-xs text-neutral-500">
                    {new Date(diseno.updatedAt).toLocaleString()}
                  </p>
                )}
                {diseno.configuracion && (
                  <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words rounded-md bg-white p-2 text-xs text-neutral-600">
                    {typeof diseno.configuracion === "string"
                      ? diseno.configuracion
                      : JSON.stringify(diseno.configuracion, null, 2)}
                  </pre>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-neutral-500">{MESSAGES.designs.empty}</p>
        )}
      </section>

      <button
        type="button"
        onClick={onLogout}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700"
      >
        <LogOut size={16} />
        {MESSAGES.navbarPanels.logout}
      </button>
    </div>
  );
};

export default ProfilePanel;
