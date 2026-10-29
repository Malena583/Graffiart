import * as yup from "yup";
import { VALIDATION as V } from "../constants/VALIDATION";
import { TAMANO_LABELS as L } from "../constants/TAMANOS";

const MAX_CM = 1000;

// Los campos numéricos vacíos llegan como "" desde el formulario.
const emptyToUndefined = (value, original) =>
  original === "" || original === null ? undefined : value;

const text = (label, max) =>
  yup
    .string()
    .trim()
    .required(V.required(label))
    .max(max, `${label} no puede superar los ${max} caracteres.`);

const dimension = (label) =>
  yup
    .number()
    .transform(emptyToUndefined)
    .typeError(V.number(label))
    .integer(V.integer(label))
    .min(1, V.greaterThanZero(label))
    .max(MAX_CM, `${label} no puede superar ${MAX_CM} cm.`)
    .required(V.required(label));

// El máximo no puede ser menor que el mínimo.
const dimensionMax = (label, minField) =>
  dimension(label).test(
    "max-mayor-que-min",
    `${label} no puede ser menor que el mínimo.`,
    function (value) {
      const min = this.parent[minField];
      return value == null || min == null || Number(value) >= Number(min);
    },
  );

export const tamanoSchema = yup.object({
  codigo: yup
    .string()
    .transform((value) =>
      typeof value === "string" ? value.trim().toUpperCase() : value,
    )
    .required(V.required(L.code))
    .matches(
      /^[A-Z][A-Z0-9_]{1,29}$/,
      "El código debe tener entre 2 y 30 caracteres: mayúsculas, números y guion bajo, empezando con una letra.",
    ),
  nombre: text(L.name, 50),
  precioBase: yup
    .number()
    .transform(emptyToUndefined)
    .typeError(V.number(L.basePrice))
    .min(0, V.nonNegative(L.basePrice))
    .required(V.required(L.basePrice)),
  altoMinCm: dimension(L.heightMin),
  altoMaxCm: dimensionMax(L.heightMax, "altoMinCm"),
  anchoMinCm: dimension(L.widthMin),
  anchoMaxCm: dimensionMax(L.widthMax, "anchoMinCm"),
  profundidadMinCm: dimension(L.depthMin),
  profundidadMaxCm: dimensionMax(L.depthMax, "profundidadMinCm"),
  activo: yup
    .boolean()
    .transform((value, original) => original === true || original === "true"),
});