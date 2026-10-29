import { ACCESORIO_CATEGORIA } from "../constants/ACCESORIOS";
import {
  crearMaterial,
  editarMaterial,
  eliminarMaterial,
  listarMateriales,
} from "./materialService";

// Los accesorios son materiales del inventario con categoría ACCESORIO.
// Este servicio reutiliza materialService: no hay otro endpoint ni otra tabla.

export const listarAccesorios = async () => {
  const materiales = await listarMateriales();
  return materiales.filter(
    (material) => material.categoria === ACCESORIO_CATEGORIA,
  );
};

export const crearAccesorio = (payload) =>
  crearMaterial({ ...payload, categoria: ACCESORIO_CATEGORIA });

// Al editar no se envían categoría ni stock: se conservan tal como están
export const editarAccesorio = (id, payload) => editarMaterial(id, payload);

export const eliminarAccesorio = (id) => eliminarMaterial(id);

export default {
  listar: listarAccesorios,
  crear: crearAccesorio,
  editar: editarAccesorio,
  eliminar: eliminarAccesorio,
};