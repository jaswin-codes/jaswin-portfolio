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
import { useEffect } from "react";
import JarvisChat from "./components/JarvisChat";
import RecruiterMode from "./pages/RecruiterMode";
import ContactForm from "./components/ContactForm";

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

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
          <ContactForm />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
