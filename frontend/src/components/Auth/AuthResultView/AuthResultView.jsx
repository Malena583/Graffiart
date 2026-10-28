import Button from "../../Button/Button";
import { LOGIN } from "../../../constants/LOGIN";

// Pantalla que se muestra después de pedir recuperar o restablecer la contraseña, con los pasos siguientes.
// Props:
//   mode: forgot (pidió el mail) o reset (cambió la contraseña)
//   recoveryLink: link para ingresar el código de recuperación
//   loginLink: link para volver a iniciar sesión
//   onRequestAnotherEmail: qué hacer al pedir que se envíe otro mail
const AuthResultView = ({mode, recoveryLink, loginLink, onRequestAnotherEmail,
}) => {
  if (mode === "forgot") {
    return (
      <div className="space-y-4">
        <p className="text-sm text-neutral-600">
          {LOGIN.forgot.result}
        </p>
        <div className="flex flex-col gap-2 pt-2">
          {recoveryLink}
          <Button
            variant="mutedText"
            type="button"
            onClick={onRequestAnotherEmail}
          >
            {LOGIN.forgot.requestAnother}
          </Button>
        </div>
      </div>
    );
  }

  if (mode === "reset") {
    return <div className="pt-2 text-center">{loginLink}</div>;
  }

  return null;
};

export default AuthResultView;