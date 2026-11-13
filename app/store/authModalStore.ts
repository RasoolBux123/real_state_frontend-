import { create } from "zustand";

type Mode = "login" | "register";

type State = {
  open: boolean;
  mode: Mode;
  redirectTo: string | null; // login ke baad kahan jana hai (optional)
  openModal: (mode?: Mode, redirectTo?: string | null) => void;
  setMode: (mode: Mode) => void;
  close: () => void;
};

export const useAuthModal = create<State>((set) => ({
  open: false,
  mode: "login",
  redirectTo: null,
  openModal: (mode = "login", redirectTo = null) => set({ open: true, mode, redirectTo }),
  setMode: (mode) => set({ mode }),
  close: () => set({ open: false, redirectTo: null }),
}));