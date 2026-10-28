const LABEL_CLASS = "block text-left text-xs font-semibold text-neutral-700";
const INPUT_CLASS =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900";

// Campo de texto simple (solo el cuadro, sin etiqueta).
// Props:
//   className: clases de estilo propias, si se quiere cambiar el aspecto
//   hasAction: true si hay un botón dentro del campo (deja lugar a la derecha)
export const Input = ({
  className,
  hasAction = false,
  ...inputProps
}) => {
  const inputClassName =
    className ?? `${INPUT_CLASS}${hasAction ? " pr-10" : ""}`;

  return <input className={inputClassName} {...inputProps} />;
};

// Elige qué dibujar dentro de TextField: un cuadro de texto, una lista desplegable o un texto largo.
// Props:
//   type: tipo de campo: text, number, select, textarea, etc.
//   options: opciones de la lista (solo para select)
//   placeholder: texto de ayuda dentro del campo
//   hasAction: true si hay un botón dentro del campo
//   className: clases de estilo propias
const Control = ({
  type,
  options,
  placeholder,
  hasAction,
  className,
  ...props
}) => {
  if (type === "select") {
    return (
      <select className={`${INPUT_CLASS} bg-white`} {...props}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (type === "textarea") {
    return (
      <textarea
        className={INPUT_CLASS}
        rows={3}
        placeholder={placeholder}
        {...props}
      />
    );
  }

  return (
    <Input
      type={type}
      className={className}
      hasAction={hasAction}
      placeholder={placeholder}
      {...props}
    />
  );
};

// Campo de formulario con su etiqueta. Sirve para texto, números, listas desplegables y textos largos.
// Props:
//   id: identificador que une la etiqueta con el campo
//   label: texto de la etiqueta
//   labelClassName: estilo propio de la etiqueta
//   labelAction: elemento a la derecha de la etiqueta (por ejemplo un link)
//   inputAction: elemento dentro del campo (por ejemplo el botón de mostrar contraseña)
//   type: tipo de campo: text, number, password, select o textarea
//   options: opciones de la lista, con value y label (solo para select)
const TextField = ({
  id,
  label,
  labelClassName = LABEL_CLASS,
  labelAction,
  inputAction,
  type = "text",
  ...controlProps
}) => {
  return (
    <div>
      <div className={labelAction ? "flex items-center justify-between" : undefined}>
        <label htmlFor={id} className={labelClassName}>
          {label}
        </label>
        {labelAction}
      </div>
      <div className="relative mt-1">
        <Control
          id={id}
          type={type}
          hasAction={Boolean(inputAction)}
          {...controlProps}
        />
        {inputAction}
      </div>
    </div>
  );
};

export default TextField;
