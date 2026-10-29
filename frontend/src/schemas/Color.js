
import * as yup from "yup";
import { COLOR_HEX_PATTERN, COLOR_LABELS as L } from "../constants/COLORES";
import { VALIDATION as V } from "../constants/VALIDATION";
 
const MAX_NOMBRE = 50;
 
export const colorSchema = yup.object({
  nombre: yup
    .string()
    .trim()
    .required(V.required(L.name))
    .max(MAX_NOMBRE, `${L.name} no puede superar los ${MAX_NOMBRE} caracteres.`),
  codigoHex: yup
    .string()
    .transform((value) =>
      typeof value === "string" ? value.trim().toUpperCase() : value,
    )
    .required(V.required(L.hex))
    .matches(
      COLOR_HEX_PATTERN,
      "El código hexadecimal debe tener el formato #RRGGBB (por ejemplo, #FF0000).",
    ),
  activo: yup
    .boolean()
    .transform((value, original) => original === true || original === "true"),
});