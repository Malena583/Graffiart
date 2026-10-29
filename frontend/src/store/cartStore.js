import { create } from "zustand";

const mapItem = (items, id, fn) =>
  items.map((item) => (item.id === id ? fn(item) : item));

export const useCartStore = create((set) => ({
  carrito: [],

  agregarAlCarrito: (gabinete) =>
    set(({ carrito }) => {
      const existe = carrito.some((item) => item.id === gabinete.id);
      return {
        carrito: existe
          ? mapItem(carrito, gabinete.id, (item) => ({
              ...item,
              cantidad: item.cantidad + 1,
            }))
          : [...carrito, { ...gabinete, cantidad: 1 }],
      };
    }),

  agregarConfiguracion: (gabinete, configuracion, precio) =>
    set(({ carrito }) => ({
      carrito: [
        ...carrito,
        {
          ...gabinete,
          nombre: gabinete.nombre,
          id: `config-${crypto.randomUUID()}`,
          gabineteId: configuracion.gabineteId ?? null,
          costoUnitario: precio,
          configuracion,
          cantidad: 1,
        },
      ],
    })),

  incrementarCantidad: (id) =>
    set(({ carrito }) => ({
      carrito: mapItem(carrito, id, (item) => ({
        ...item,
        cantidad: item.cantidad + 1,
      })),
    })),

  decrementarCantidad: (id) =>
    set(({ carrito }) => ({
      carrito: mapItem(carrito, id, (item) => ({
        ...item,
        cantidad: Math.max(1, item.cantidad - 1),
      })),
    })),

  removerDelCarrito: (id) =>
    set(({ carrito }) => ({
      carrito: carrito.filter((item) => item.id !== id),
    })),

  vaciarCarrito: () => set({ carrito: [] }),
}));

export const selectCantidadTotal = (state) =>
  state.carrito.reduce((acc, item) => acc + item.cantidad, 0);

export const selectPrecioTotal = (state) =>
  state.carrito.reduce(
    (acc, item) => acc + Number(item.costoUnitario ?? 0) * item.cantidad,
    0,
  );
