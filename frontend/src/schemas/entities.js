import * as yup from "yup";
import { FIELD_LABELS as L, VALIDATION as V } from "../constants/VALIDATION";

const text = (label) => yup.string().trim().required(V.required(label));
const optionalText = yup.string().trim().default("");

const nonNegative = (label) =>
  yup
    .number()
    .typeError(V.number(label))
    .min(0, V.nonNegative(label))
    .required(V.required(label));

const positiveInteger = (label) =>
  yup
    .number()
    .typeError(V.number(label))
    .integer(V.integer(label))
    .min(1, V.greaterThanZero(label))
    .required(V.required(label));

export const categoriaSchema = yup.object({
  nombre: text(L.name),
  descripcion: optionalText,
});

export const productoSchema = yup.object({
  nombre: text(L.name),
  marca: text(L.brand),
  costoUnitario: nonNegative(L.unitCost),
  stockActual: nonNegative(L.currentStock).integer(),
  stockMinimo: nonNegative(L.minStock).integer(),
  tamano: text(L.size),
  formato: text(L.format),
  materialChasis: text(L.chassisMaterial),
  panel: text(L.panel),
  categoriaId: yup.string().nullable().transform((v) => v || null),
  imagen: yup.string().default(""),
});

export const materialSchema = yup.object({
  nombre: text(L.name),
  codigo: text(L.code),
  categoria: text(L.category),
  unidadMedida: text(L.unit),
  stockActual: positiveInteger(L.currentStock),
  stockMinimo: positiveInteger(L.minStock),
  costoUnitario: yup
    .number()
    .transform((value, original) => (original === "" ? null : value))
    .nullable()
    .min(0, V.nonNegative(L.unitCost)),
  descripcion: optionalText,
});

export const perfilSchema = yup.object({
  nombre: optionalText,
  apellido: optionalText,
  telefono: optionalText,
});

export const disenoNombreSchema = yup.string().trim().required(V.designName);
