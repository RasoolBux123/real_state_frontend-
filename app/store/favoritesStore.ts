import { create } from "zustand";
import { addFavorite, getFavorites, removeFavorite } from "../lib/favoriteApi";

type State = {
  ids: string[];
  load: () => Promise<void>;
  clear: () => void;
  toggle: (id: string) => Promise<void>;
};

export const useFavorites = create<State>((set, get) => ({
  ids: [],
  load: async () => {
    try {
      const list = await getFavorites();
      set({ ids: list.map((p) => p.id) });
    } catch {
      /* ignore: heart simply starts empty */
    }
  },
  clear: () => set({ ids: [] }),
  toggle: async (id) => {
    const had = get().ids.includes(id);
    // optimistic update
    set({ ids: had ? get().ids.filter((x) => x !== id) : [...get().ids, id] });
    try {
      if (had) await removeFavorite(id);
      else await addFavorite(id);
    } catch {
      set({ ids: had ? [...get().ids, id] : get().ids.filter((x) => x !== id) });
    }
  },
}));
