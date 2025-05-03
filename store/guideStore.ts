import { create } from "zustand";
import { Guide } from "@/components/ChooseGuide";

declare interface GuidesStore {
  guides: Guide[];
  selectedGuide: string | null;
  setSelectedGuide: (guideId: string) => void;
  setGuides: (guides: Guide[]) => void;
  clearSelectedGuide: () => void;
}

export const useGuideStore = create<GuidesStore>((set) => ({
  guides: [] as Guide[],
  selectedGuide: null,
  setSelectedGuide: (guideId: string) =>
    set(() => ({ selectedGuide: guideId })),
  setGuides: (guides: Guide[]) => set(() => ({ guides })),
  clearSelectedGuide: () => set(() => ({ selectedGuide: null })),
}));
