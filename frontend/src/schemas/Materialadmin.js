import * as yup from "yup";
import { VALIDATION as V } from "../constants/VALIDATION";
import { UNIDADES_MEDIDA } from "../constants/CATALOGO";
import {
  MATERIAL_LABELS as L,
  MATERIAL_LIMITS as LIM,
  MATERIAL_TYPE_OPTIONS,
} from "../constants/MATERIALES";

const maxMsg = (label, max) =>
  `${label} no puede superar los ${max} caracteres.`;

const text = (label, max) =>
  yup
    .string()
    .trim()
    .required(V.required(label))
    .max(max, maxMsg(label, max));

// "" -> valor por defecto (el backend también lo trata como 0)
const optionalInt = (label) =>
  yup
    .number()
    .transform((value, original) => (original === "" ? 0 : value))
    .typeError(V.number(label))
    .integer(V.integer(label))
    .min(0, V.nonNegative(label));

export const materialAdminSchema = yup.object({
  nombre: text(L.name, LIM.name),
  codigo: text(L.code, LIM.code),
  categoria: yup
    .string()
    .oneOf(MATERIAL_TYPE_OPTIONS.map((o) => o.value), V.required(L.category))
    .required(V.required(L.category)),
  unidadMedida: yup
    .string()
    .oneOf(UNIDADES_MEDIDA, V.required(L.unit))
    .required(V.required(L.unit)),
  costoUnitario: yup
    .number()
    .transform((value, original) => (original === "" ? null : value))
    .typeError(V.number(L.cost))
    .nullable()
    .min(0, V.nonNegative(L.cost))
    .max(LIM.maxCost, maxMsg(L.cost, LIM.maxCost)),
  stockMinimo: optionalInt(L.minStock),
  // Solo se completa al crear; al editar el backend lo ignora
  stockActual: optionalInt(L.initialStock),
  activo: yup
    .boolean()
    .transform((value, original) =>
      original === "true" ? true : original === "false" ? false : value,
    )
    .default(true),
  descripcion: yup
    .string()
    .trim()
    .max(LIM.description, maxMsg("La descripción", LIM.description))
    .default(""),
});

export const stockMovimientoSchema = yup.object({
  tipo: yup
    .string()
    .oneOf(["ENTRADA", "SALIDA", "AJUSTE"])
    .required(V.required("El tipo de movimiento")),
  cantidad: yup
    .number()
    .transform((value, original) => (original === "" ? undefined : value))
    .typeError(V.number(L.quantity))
    .integer(V.integer(L.quantity))
    .required(V.required(L.quantity))
    .when("tipo", {
      is: "AJUSTE",
      then: (schema) => schema.min(0, V.nonNegative(L.quantity)),
      otherwise: (schema) => schema.min(1, V.greaterThanZero(L.quantity)),
    }),
  motivo: yup
    .string()
    .trim()
    .max(LIM.reason, maxMsg("El motivo", LIM.reason))
    .default(""),
});