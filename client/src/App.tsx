import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Landing from "./pages/Landing";
import ProjectsSection from "./pages/Projects";
import AboutSection from "./pages/About";
import ExperienceSection from "./pages/Experience";
import ResearchSection from "./pages/Research";
import SkillsSection from "./pages/Skills";
import AchievementsSection from "./pages/Achievements";
import { useAppStore } from "@/stores/appStore";
import { useEffect, useState, useCallback } from "react";
import JarvisChat from "./components/JarvisChat";
import RecruiterMode from "./pages/RecruiterMode";
import ContactForm from "./components/ContactForm";
import { LoadingScreen } from "./components/LoadingScreen";
import SectionTransition from "./components/SectionTransition";
import { RESUME_URL } from "@/data/portfolioData";
import { FileDown } from "lucide-react";
import { motion } from "framer-motion";

// ── Section transition manager ──────────────────────────────────────────────
function useTransitionRouter() {
  const [, setLocation] = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetSection, setTargetSection] = useState<string | undefined>();
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  const navigateTo = useCallback((path: string, section?: string) => {
    setTargetSection(section || path.replace('/', ''));
    setIsTransitioning(true);
    setPendingPath(path);
  }, []);

  const handleTransitionComplete = useCallback(() => {
    if (pendingPath) {
      setLocation(pendingPath);
      setPendingPath(null);
    }
    setIsTransitioning(false);
  }, [pendingPath, setLocation]);

  return { navigateTo, isTransitioning, targetSection, handleTransitionComplete };
}

// Expose navigate globally so Landing/sections can trigger transitions
export let navigateWithTransition: (path: string, section?: string) => void = () => {};

function Router({ navigateTo }: { navigateTo: (path: string, section?: string) => void }) {
  const mode = useAppStore((state) => state.mode);

  // Expose globally
  useEffect(() => {
    navigateWithTransition = navigateTo;
  }, [navigateTo]);

  if (mode === 'recruiter') {
    return (
      <>
        <RecruiterMode />
        <JarvisChat />
      </>
    );
  }

  return (
    <>
      <Switch>
        <Route path={"/"} component={Landing} />
        <Route path={"/projects"} component={ProjectsSection} />
        <Route path={"/about"} component={AboutSection} />
        <Route path={"/experience"} component={ExperienceSection} />
        <Route path={"/research"} component={ResearchSection} />
        <Route path={"/skills"} component={SkillsSection} />
        <Route path={"/achievements"} component={AchievementsSection} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
      <JarvisChat />
    </>
  );
}

// ── Resume download button (always visible in 3D mode) ──────────────────────
function ResumeButton() {
  const mode = useAppStore((state) => state.mode);
  if (mode === 'recruiter') return null;
  return (
    <motion.a
      href={RESUME_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold select-none"
      style={{
        backgroundColor: 'rgba(0,0,0,0.75)',
        borderColor: '#00ff88',
        color: '#00ff88',
        fontFamily: "'JetBrains Mono', monospace",
        backdropFilter: 'blur(8px)',
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5 }}
      whileHover={{ backgroundColor: 'rgba(0,255,136,0.15)', scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <FileDown size={16} />
      Resume
    </motion.a>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const { navigateTo, isTransitioning, targetSection, handleTransitionComplete } = useTransitionRouter();

  // Load recruiter mode preference from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('portfolioMode') as 'recruiter' | '3d' | null;
    if (savedMode) {
      useAppStore.setState({ mode: savedMode });
    }
  }, []);

  // Save recruiter mode preference to localStorage on change
  const mode = useAppStore((state) => state.mode);
  useEffect(() => {
    localStorage.setItem('portfolioMode', mode);
  }, [mode]);

  // Simulate loading progress
  useEffect(() => {
    setIsLoading(true);
    setProgress(10);
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + Math.random() * 20 : prev));
    }, 300);
    const completeLoading = () => {
      setProgress(100);
      setTimeout(() => setIsLoading(false), 600);
    };
    if (document.readyState === 'complete') {
      completeLoading();
    } else {
      window.addEventListener('load', completeLoading);
    }
    return () => {
      clearInterval(progressInterval);
      window.removeEventListener('load', completeLoading);
    };
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <LoadingScreen isLoading={isLoading} progress={progress} />
          <Toaster />
          <Router navigateTo={navigateTo} />
          <ContactForm />
          <ResumeButton />
          <SectionTransition
            isTransitioning={isTransitioning}
            targetSection={targetSection}
            onComplete={handleTransitionComplete}
          />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
