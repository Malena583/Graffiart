//frontend/src/pages/AdminProductos/ProductoFormModal.jsx
import Button from "../../components/Button/Button";
import Feedback from "../../components/Feedback/Feedback";
import Modal from "../../components/Modal/Modal";
import ProductImageField from "../../components/ProductImageField/ProductImageField";
import TextField from "../../components/TextField/TextField";
import { PRODUCTO_FORM } from "../../constants/FORMS";
import { MESSAGES } from "../../constants/MESSAGES";

const M = MESSAGES.admin.productos;

// Ventana con el formulario para crear o editar un producto.
// Props:
//   editing: true si se está editando un producto existente
//   values: valores actuales de los campos
//   onChange: se ejecuta cuando el usuario escribe o elige algo
//   onSubmit: se ejecuta al guardar
//   onCancel: cierra la ventana sin guardar
//   saving: true mientras se guarda (desactiva los botones)
//   error: mensaje de error a mostrar dentro de la ventana
//   categorias: categorías reales traídas de la API
//   categoriasError: true si no se pudieron cargar las categorías
//   imageError / onImageError: error de la imagen y cómo actualizarlo
const ProductoFormModal = ({
  editing,
  values,
  onChange,
  onSubmit,
  onCancel,
  saving,
  error,
  categorias,
  categoriasError,
  imageError,
  onImageError,
}) => {
  // Mismos campos que ya usaba el proyecto; la categoría y la imagen
  // se colocan después del stock, como antes.
  const fields = [
    ...PRODUCTO_FORM.fields.slice(0, 5),
    {
      ...PRODUCTO_FORM.categoryField,
      options: (categorias ?? []).map((c) => ({ value: c.id, label: c.nombre })),
    },
    {
      name: "imagen",
      half: false,
      render: () => (
        <ProductImageField
          values={values}
          onChange={onChange}
          editing={editing}
          error={imageError}
          onError={onImageError}
        />
      ),
    },
    ...PRODUCTO_FORM.fields.slice(5),
  ];

  return (
    <Modal
      title={editing ? PRODUCTO_FORM.editTitle : PRODUCTO_FORM.createTitle}
      onClose={onCancel}
      closeOnBackdrop={false}
      size="lg"
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {categoriasError && (
          <Feedback type="warning">{M.categoriesLoadError}</Feedback>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map(({ half, render, ...field }, index) => (
            <div key={field.name} className={half ? "" : "sm:col-span-2"}>
              {render ? (
                render()
              ) : (
                <TextField
                  id={field.name}
                  value={values[field.name] ?? ""}
                  onChange={onChange}
                  autoFocus={index === 0}
                  {...field}
                />
              )}
            </div>
          ))}
        </div>

        {/* El error va junto a los botones para que se vea sin hacer scroll */}
        {error && <Feedback type="error">{error}</Feedback>}

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={saving}>
            {MESSAGES.actions.cancel}
          </Button>
          <Button type="submit" variant="compact" disabled={saving}>
            {editing ? MESSAGES.actions.saveChanges : PRODUCTO_FORM.createLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductoFormModal;