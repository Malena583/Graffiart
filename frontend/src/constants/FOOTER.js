import { ROUTES } from "./ROUTES";

export const FOOTER = {
  storeLinks: [
    { label: "Todos los productos", to: ROUTES.products },
    { label: "Configurador", to: ROUTES.configurator },
  ],
  helpLinks: [
    { label: "Mi perfil", to: ROUTES.profile },
    { label: "Carrito", to: ROUTES.cart },
  ],
  description: "Accesorios para llevar tu setup al siguiente nivel.",
  social: {
    instagram: "Instagram",
    facebook: "Facebook",
    instagramUrl: "https://www.instagram.com/",
    facebookUrl: "https://www.facebook.com/",
  },
  store: {
    title: "Tienda",
  },
  help: {
    title: "Mi cuenta",
  },
  shipping: {
    title: "Envíos a todo el país",
    description: "Consultá las condiciones de envío.",
  },
  copyright: "GraffiArt. Todos los derechos reservados.",
};