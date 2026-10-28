import { create } from "zustand";
import { STORAGE_KEYS } from "../constants/APP";

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.user) || "null");
  } catch {
    return null;
  }
};

export const useAuthStore = create((set) => ({
  usuario: readStoredUser(),
  token: localStorage.getItem(STORAGE_KEYS.token) || null,
  login: (usuario, token) => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.setItem(STORAGE_KEYS.token, token);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(usuario));
    set({ usuario, token });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
    set({ usuario: null, token: null });
  },
}));
