export const LOGIN = {
  title: "Iniciar sesión",
  subtitle: "Ingresá con tu cuenta para continuar.",
  relogin: "Iniciar sesión",
  hasAccount: "¿Ya tenés una cuenta?",
  hasntAccount: "¿No tenés una cuenta?",
  badge: {
    access: "Acceso Seguro",
    recovery: "Recuperación",
  },
  register: {
    title: "Creá tu cuenta",
    subtitle: "Diseñá y personalizá tu gabinete ideal en GraffiArt.",
    tab: "Registrarme",
    submit: "Crear mi cuenta",
    success: "Registro exitoso. Ya podés iniciar sesión.",
  },
  forgot: {
    title: "¿Olvidaste tu contraseña?",
    subtitle:
      "Ingresá tu correo electrónico para recibir las instrucciones de recuperación.",
    submit: "Enviar enlace de recuperación",
    success:
      "Si el email está registrado, recibirás un correo con las instrucciones.",
    emptyEmail: "Por favor ingresá tu email.",
    result:
      "Revisá tu casilla de correo. Si tenés el código de recuperación, podés ingresarlo directamente:",
    recoveryLink: "Ingresar código de recuperación",
    requestAnother: "Solicitar otro correo",
  },
  reset: {
    title: "Nueva Contraseña",
    subtitle: "Ingresá tu nueva clave (mínimo 8 caracteres).",
    subtitleNoToken: "Ingresá tu código de recuperación y tu nueva clave.",
    submit: "Guardar nueva contraseña",
    success: "¡Contraseña actualizada con éxito! Ya podés iniciar sesión.",
    codeLabel: "Código o Token de recuperación",
    codePlaceholder: "Pegá el código recibido",
    emptyCode: "Debes ingresar el código o token de recuperación.",
    newPassword: "Nueva Contraseña",
  },
  form: {
    name: "Nombre",
    surname: "Apellido",
    phone: "Teléfono",
    optional: "(opcional)",
    email: "Email",
    password: "Contraseña",
    confirmPassword: "Confirmar Contraseña",
    forgotPassword: "¿Olvidaste tu contraseña?",
    showPassword: "Ver contraseña",
    hidePassword: "Ocultar contraseña",
    showConfirmPassword: "Ver confirmación de contraseña",
    hideConfirmPassword: "Ocultar confirmación de contraseña",
    namePlaceholder: "Mateo",
    surnamePlaceholder: "Bernal",
    phonePlaceholder: "+54 9 11 1234-5678",
    emailPlaceholder: "ejemplo@correo.com",
    passwordPlaceholder: "••••••••",
    passwordMinPlaceholder: "Mínimo 8 caracteres",
    confirmPasswordPlaceholder: "Repetí la contraseña",
    processing: "Procesando...",
  },
  footer: {
    forgotLogin: "¿Recordaste tu contraseña?",
    registerLogin: "¿Ya tenés una cuenta?",
  },
  ERRORS: {
    email: "Ingrese un correo electrónico válido",
    password: "La contraseña debe tener al menos 6 caracteres",
    passwordMin: "La contraseña debe tener al menos 8 caracteres.",
    passwordMismatch: "Las contraseñas no coinciden.",
    request: "Ocurrió un error. Por favor, intentá nuevamente.",
    unsupportedMode: (mode) => `Modo de autenticación no soportado: ${mode}`,
  },
  REQUIRED: {
    email: "El correo electrónico es obligatorio",
    password: "La contraseña es obligatoria",
  },
};

// export const LOGIN = {
//   title: "Iniciar sesión",
//   subtitle: "Ingresá con tu cuenta para continuar.",
//   relogin: "Volver a Iniciar Sesión",
//   hasAccount: "¿Ya tenés una cuenta?",
//   hasntAccount: "¿No tenés una cuenta?",
//   ERRORS: {
//     email: "Ingrese un correo electrónico válido",
//     password: "La contraseña debe tener al menos 6 caracteres",
//   },
//   REQUIRED: {
//     email: "El correo electrónico es obligatorio",
//     password: "La contraseña es obligatoria",
//   },

//   RESET: {
//     title: "Restablecer contraseña",
//     subtitle: "Ingresá tu nueva clave (mínimo 8 caracteres).",
//     subtitleNoToken: "Ingresá tu código de recuperación y tu nueva clave.",
//   },
// };
