const VARIANT_CLASSES = {
  primary:
    "mt-2 w-full cursor-pointer rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50",
  danger:
    "inline-flex items-center justify-center rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-50",
  text: "cursor-pointer text-xs text-blue-600 hover:text-blue-800 hover:underline",
  mutedText:
    "mt-1 cursor-pointer text-xs text-neutral-500 underline hover:text-neutral-900",
  verify:
    "w-full rounded-lg bg-neutral-900 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50",
  secondary:
    "cursor-pointer rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50 disabled:opacity-50",
  compact:
    "cursor-pointer rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50",
  outlineDanger:
    "cursor-pointer rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50",
  linkEdit: "cursor-pointer text-sm text-blue-600 hover:text-blue-800 hover:underline",
  linkDelete: "cursor-pointer text-sm text-red-600 hover:text-red-800 hover:underline",
  passwordToggle:
    "absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-xs text-neutral-400 hover:text-neutral-700",
};

// Botón reutilizable con distintos estilos.
// Props:
//   variant: estilo: primary, secondary, compact, danger, linkEdit, linkDelete, etc.
//   type: button (por defecto) o submit para enviar formularios
//   children: texto o contenido del botón
const Button = ({
  variant = "primary",
  type = "button",
  children,
  ...buttonProps
}) => {
  return (
    <button
      type={type}
      className={VARIANT_CLASSES[variant]}
      {...buttonProps}
    >
      {children}
    </button>
  );
};

export default Button;
