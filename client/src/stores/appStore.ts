import { create } from "zustand";

export type AppMode = "3d" | "recruiter";
export type SectionId =
  | "projects"
  | "about"
  | "experience"
  | "research"
  | "skills"
  | "achievements"
  | null;

interface AppState {
  mode: AppMode;
  currentSection: SectionId;
  isIntroComplete: boolean;
  isLoading: boolean;
  jarvisOpen: boolean;
  showContactForm: boolean;
  setMode: (mode: AppMode) => void;
  setCurrentSection: (section: SectionId) => void;
  setIntroComplete: () => void;
  setIsLoading: (loading: boolean) => void;
  setJarvisOpen: (open: boolean) => void;
  setShowContactForm: (show: boolean) => void;
}

export const useAppStore = create<AppState>(set => ({
  mode: "3d",
  currentSection: null,
  isIntroComplete: false,
  isLoading: false,
  jarvisOpen: false,
  showContactForm: false,
  setMode: mode => set({ mode }),
  setCurrentSection: section => set({ currentSection: section }),
  setIntroComplete: () => set({ isIntroComplete: true }),
  setIsLoading: loading => set({ isLoading: loading }),
  setJarvisOpen: open => set({ jarvisOpen: open }),
  setShowContactForm: show => set({ showContactForm: show }),
}));
