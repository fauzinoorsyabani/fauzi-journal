/**
 * Style guide: Editorial Noir / Premium Web3 Gallery.
 * A dark global shell keeps every route within the same cinematic visual world.
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import StoryIndex from "@/pages/StoryIndex";
import StoryPage from "@/pages/StoryPage";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";


function Router() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/stories"} component={StoryIndex} />
        <Route path={"/stories/:slug"} component={StoryPage} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
      <SiteFooter />
    </div>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
