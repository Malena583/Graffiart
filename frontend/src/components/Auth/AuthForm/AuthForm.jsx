import { useState } from "react";
import Button from "../../Button/Button";
import TextField from "../../TextField/TextField";
import { LOGIN } from "../../../constants/LOGIN";

// Formulario de acceso. Cambia sus campos según el modo: iniciar sesión, registrarse, recuperar o restablecer contraseña.
// Props:
//   mode: qué formulario mostrar: login, register, forgot o reset
//   form: valores que el usuario escribió
//   onFieldChange: se ejecuta cada vez que el usuario escribe
//   onSubmit: se ejecuta al enviar el formulario
//   isLoading: true mientras se espera la respuesta del servidor
//   hasResetToken: true si el código de recuperación ya vino en el link
//   onForgotPassword: qué hacer al tocar "¿Olvidaste tu contraseña?"
const AuthForm = ({idPrefix = "auth", mode, form, onFieldChange, onSubmit, isLoading, hasResetToken, onForgotPassword,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const showPasswordField =
    mode === "login" || mode === "register" || mode === "reset";
  const showConfirmPasswordField = mode === "register" || mode === "reset";

  const submitLabel = {
    reset: LOGIN.reset.submit,
    register: LOGIN.register.submit,
    forgot: LOGIN.forgot.submit,
    login: LOGIN.title,
  }[mode];

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {mode === "register" && (
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label={LOGIN.form.name}
            id={`${idPrefix}-nombre`}
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={onFieldChange}
            required
            autoComplete="given-name"
            placeholder={LOGIN.form.namePlaceholder}
          />
          <TextField
            label={LOGIN.form.surname}
            id={`${idPrefix}-apellido`}
            type="text"
            name="apellido"
            value={form.apellido}
            onChange={onFieldChange}
            required
            autoComplete="family-name"
            placeholder={LOGIN.form.surnamePlaceholder}
          />
        </div>
      )}

      {mode === "register" && (
        <TextField
          label={
            <>
              {LOGIN.form.phone}{" "}
              <span className="font-normal text-neutral-400">
                {LOGIN.form.optional}
              </span>
            </>
          }
          id={`${idPrefix}-telefono`}
          type="tel"
          name="telefono"
          value={form.telefono}
          onChange={onFieldChange}
          autoComplete="tel"
          placeholder={LOGIN.form.phonePlaceholder}
        />
      )}

      {mode !== "reset" && (
        <TextField
          label={LOGIN.form.email}
          id={`${idPrefix}-email`}
          type="email"
          name="email"
          value={form.email}
          onChange={onFieldChange}
          required
          autoComplete="email"
          placeholder={LOGIN.form.emailPlaceholder}
        />
      )}

      {mode === "reset" && !hasResetToken && (
        <TextField
          label={LOGIN.reset.codeLabel}
          id={`${idPrefix}-reset-code`}
          type="text"
          name="resetCode"
          value={form.resetCode}
          onChange={onFieldChange}
          required
          placeholder={LOGIN.reset.codePlaceholder}
        />
      )}

      {showPasswordField && (
        <TextField
          label={mode === "reset" ? LOGIN.reset.newPassword : LOGIN.form.password}
          id={`${idPrefix}-password`}
          labelAction={
            mode === "login" && (
              <Button
                variant="text"
                type="button"
                onClick={onForgotPassword}
              >
                {LOGIN.form.forgotPassword}
              </Button>
            )
          }
          inputAction={
            <Button
              variant="passwordToggle"
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={
                showPassword
                  ? LOGIN.form.hidePassword
                  : LOGIN.form.showPassword
              }
              aria-pressed={showPassword}
            >
              {showPassword
                ? LOGIN.form.hidePassword
                : LOGIN.form.showPassword}
            </Button>
          }
          type={showPassword ? "text" : "password"}
          name="password"
          value={form.password}
          onChange={onFieldChange}
          required
          minLength={mode === "login" ? undefined : 8}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          placeholder={
            mode === "login"
              ? LOGIN.form.passwordPlaceholder
              : LOGIN.form.passwordMinPlaceholder
          }
        />
      )}

      {showConfirmPasswordField && (
        <TextField
          label={LOGIN.form.confirmPassword}
          id={`${idPrefix}-confirm-password`}
          inputAction={
            <Button
              variant="passwordToggle"
              type="button"
              onClick={() => setShowConfirmPassword((visible) => !visible)}
              aria-label={
                showConfirmPassword
                  ? LOGIN.form.hideConfirmPassword
                  : LOGIN.form.showConfirmPassword
              }
              aria-pressed={showConfirmPassword}
            >
              {showConfirmPassword
                ? LOGIN.form.hidePassword
                : LOGIN.form.showPassword}
            </Button>
          }
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={onFieldChange}
          required
          minLength={8}
          autoComplete="new-password"
          placeholder={LOGIN.form.confirmPasswordPlaceholder}
        />
      )}

      <Button
        variant="primary"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
            />
            {LOGIN.form.processing}
          </span>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
};

export default AuthForm;