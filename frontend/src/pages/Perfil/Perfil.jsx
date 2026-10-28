import { useNavigate } from "react-router";
import Button from "../../components/Button/Button";
import EntityForm from "../../components/EntityForm/EntityForm";
import Feedback from "../../components/Feedback/Feedback";
import MainContainer from "../../components/MainContainer/MainContainer";
import SavedDesigns from "../../components/SavedDesigns/SavedDesigns";
import StateMessage from "../../components/StateMessage/StateMessage";
import { MESSAGES } from "../../constants/MESSAGES";
import { usePerfil, usePerfilForm } from "../../hooks/usePerfil";
import { useAuthStore } from "../../store/authStore";
import { PERFIL_FORM } from "../../constants/FORMS";
import { ROUTES } from "../../constants/ROUTES";

const M = MESSAGES.profile;

// Formulario para editar los datos personales del usuario.
// Props:
//   perfil: datos actuales del usuario
const PerfilForm = ({ perfil }) => {
  const { email, values, saving, error, success, onChange, onSubmit } =
    usePerfilForm(perfil);

  return (
    <div className="space-y-4">
      {error && <Feedback type="error">{error}</Feedback>}
      {success && <Feedback type="success">{success}</Feedback>}
      <EntityForm
        fields={[PERFIL_FORM.emailField, ...PERFIL_FORM.fields]}
        values={{ ...values, email }}
        onChange={onChange}
        onSubmit={onSubmit}
        submitLabel={saving ? M.saving : M.save}
        submitting={saving}
        columns={1}
      />
    </div>
  );
};

// Página de perfil: datos personales, diseños guardados y cerrar sesión.
const Perfil = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { perfil, loading, error } = usePerfil();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.login);
  };

  const handleOpenDesign = (configuracion) => {
    navigate(ROUTES.configurator, { state: { configuracion } });
  };

  return (
    <MainContainer
      title={M.title}
      width="xl"
      actions={
        <Button variant="outlineDanger" onClick={handleLogout}>
          {M.logout}
        </Button>
      }
    >
      {loading ? (
        <StateMessage>{M.loading}</StateMessage>
      ) : perfil ? (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1.4fr]">
          <PerfilForm perfil={perfil} />
          <SavedDesigns compact title={M.designs} onLoadDesign={handleOpenDesign} />
        </div>
      ) : (
        <Feedback type="error">{error}</Feedback>
      )}
    </MainContainer>
  );
};

export default Perfil;
