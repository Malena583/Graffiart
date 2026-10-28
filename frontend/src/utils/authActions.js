import { LOGIN } from "../constants/LOGIN";

const validatePassword = (form) => {
  if (form.password.length < 8) {
    return LOGIN.ERRORS.passwordMin;
  }
  if (form.password !== form.confirmPassword) {
    return LOGIN.ERRORS.passwordMismatch;
  }
  return "";
};

export const submitAuthAction = async ({ mode, form, token, service }) => {
  if (mode === "reset") {
    const validationError = validatePassword(form);
    if (validationError) return { error: validationError };

    const activeToken = (token || form.resetCode).trim().toLowerCase();
    if (!activeToken) {
      return { error: LOGIN.reset.emptyCode };
    }

    const response = await service.resetPassword({
      token: activeToken,
      password: form.password,
    });
    return {
      message:
        response.message ||
        LOGIN.reset.success,
      actionComplete: true,
    };
  }

  if (mode === "register") {
    const validationError = validatePassword(form);
    if (validationError) return { error: validationError };

    const response = await service.registerUser({
      nombre: form.nombre,
      apellido: form.apellido,
      email: form.email,
      password: form.password,
      telefono: form.telefono,
    });
    return {
      message:
        response.message ||
        LOGIN.register.success,
      actionComplete: true,
    };
  }

  if (mode === "forgot") {
    const email = form.email.trim();
    if (!email) return { error: LOGIN.forgot.emptyEmail };

    const response = await service.requestPasswordReset(email);
    return {
      message:
        response.message ||
        LOGIN.forgot.success,
      actionComplete: true,
    };
  }

  if (mode === "login") {
    const response = await service.loginUser({
      email: form.email.trim(),
      password: form.password,
    });
    return { loginResponse: response };
  }

  throw new Error(LOGIN.ERRORS.unsupportedMode(mode));
};
