import { Link } from "react-router";
import heroImage from "../../assets/hero.avif";
import { HERO } from "../../constants/HERO";
import { ROUTES } from "../../constants/ROUTES";

// Banner grande de la página de inicio, con imagen de fondo, frase y botón para ir a los productos.
const Hero = () => {
  return (
    <section className="relative flex min-h-[480px] flex-1 items-center overflow-hidden bg-neutral-900 sm:min-h-[560px]">
      <img
        src={heroImage}
        alt={HERO.imagealt}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 lg:px-16">
        <h1 className="max-w-2xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
          {HERO.descripcion}
        </h1>
        <Link
          to={ROUTES.products}
          className="mt-8 inline-flex rounded-lg bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200"
        >
          {HERO.buttonText}
        </Link>
      </div>
    </section>
  );
};

export default Hero;