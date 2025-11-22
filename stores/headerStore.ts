"use client";
import { create } from "zustand";

type HeaderState = {
  bannerHeight: number;
  setBannerHeight: (height: number) => void;
  headerHidden: boolean;
  setHeaderHidden: (hidden: boolean) => void;
};

export const useHeaderStore = create<HeaderState>((set) => ({
  bannerHeight: 0,
  setBannerHeight: (height: number) =>
    set({ bannerHeight: Math.max(0, height) }),
  headerHidden: false,
  setHeaderHidden: (hidden: boolean) => set({ headerHidden: hidden }),
}));
