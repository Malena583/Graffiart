import * as yup from "yup";
import { FIELD_LABELS as L, VALIDATION as V } from "../constants/VALIDATION";

const text = (label) => yup.string().trim().required(V.required(label));

// Igual que materialSchema pero sin stock: el stock se gestiona en Inventario.
export const accesorioSchema = yup.object({
  nombre: text(L.name),
  codigo: text(L.code),
  unidadMedida: text(L.unit),
  costoUnitario: yup
    .number()
    .typeError(V.number(L.unitCost))
    .transform((value, original) => (original === "" ? null : value))
    .nullable()
    .min(0, V.nonNegative(L.unitCost)),
  descripcion: yup.string().trim().default(""),
});