import { LOGIN } from "../constants/LOGIN";
import { ROUTES } from "../constants/ROUTES";

export const getAuthMode = (pathname, modeFromQuery) => {
  const path = pathname.toLowerCase();

  if (path === ROUTES.resetPassword) return "reset";
  if (path === ROUTES.forgotPassword || modeFromQuery === "forgot") {
    return "forgot";
  }
  if (path === ROUTES.register || modeFromQuery === "register") {
    return "register";
  }
  return "login";
};

export const getAuthHeading = (mode, hasToken) => {
  switch (mode) {
    case "reset":
      return {
        title: LOGIN.reset.title,
        subtitle: hasToken
          ? LOGIN.reset.subtitle
          : LOGIN.reset.subtitleNoToken,
      };
    case "forgot":
      return {
        title: LOGIN.forgot.title,
        subtitle: LOGIN.forgot.subtitle,
      };
    case "register":
      return {
        title: LOGIN.register.title,
        subtitle: LOGIN.register.subtitle,
      };
    default:
      return {
        title: LOGIN.title,
        subtitle: LOGIN.subtitle,
      };
  }
};
