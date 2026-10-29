import { ACCESORIO_CATEGORIA } from "../constants/ACCESORIOS";
import {
  cambiarEstadoMaterial,
  crearMaterial,
  editarMaterial,
  listarMateriales,
} from "./materialService";
 
// La sección Materiales usa los mismos endpoints que Inventario y Accesorios
// (tabla `material`). Solo se excluyen los accesorios, que tienen su sección.
 
export const listarMaterialesAdmin = async () => {
  const materiales = await listarMateriales();
  return materiales.filter(
    (material) => material.categoria !== ACCESORIO_CATEGORIA,
  );
};
 
export default {
  listar: listarMaterialesAdmin,
  crear: crearMaterial,
  editar: editarMaterial,
  cambiarEstado: cambiarEstadoMaterial,
};