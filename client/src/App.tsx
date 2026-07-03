import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
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
import { useEffect, useState } from "react";
import JarvisChat from "./components/JarvisChat";
import RecruiterMode from "./pages/RecruiterMode";
import ContactForm from "./components/ContactForm";
import { LoadingScreen } from "./components/LoadingScreen";

function Router() {
  const mode = useAppStore((state) => state.mode);

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
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
      <JarvisChat />
    </>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

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
    // Start loading
    setIsLoading(true);
    setProgress(10);

    // Simulate asset loading
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) {
          return prev + Math.random() * 20;
        }
        return prev;
      });
    }, 300);

    // Complete loading when DOM is ready
    const completeLoading = () => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
      }, 600);
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
          <Router />
          <ContactForm />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
