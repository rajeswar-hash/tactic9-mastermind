import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const getRouterBasename = () => {
  if (typeof window === "undefined") return "/";

  if (window.location.hostname.endsWith("github.io")) {
    const [, repoName] = window.location.pathname.split("/");
    return repoName ? `/${repoName}` : "/";
  }

  return "/";
};

const normalizeGithubPagesRedirect = (basename: string) => {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const redirectedPath = params.get("p");

  if (!redirectedPath) return;

  const routePath = redirectedPath.startsWith("/") ? redirectedPath : `/${redirectedPath}`;
  const restoredQuery = params.get("q");
  const restoredHash = params.get("h");

  const fullPath = basename === "/"
    ? routePath
    : `${basename}${routePath === "/" ? "" : routePath}`;

  const nextUrl = `${fullPath}${restoredQuery ? `?${restoredQuery}` : ""}${restoredHash ? `#${restoredHash}` : ""}`;

  window.history.replaceState(null, "", nextUrl);
};

const routerBasename = getRouterBasename();
normalizeGithubPagesRedirect(routerBasename);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={routerBasename}>
        <Routes>
          <Route path="/" element={<Index initialPage="home" />} />
          <Route path="/about" element={<Index initialPage="about" />} />
          <Route path="/howto" element={<Index initialPage="howto" />} />
          <Route path="/how-to-play" element={<Index initialPage="howto" />} />
          <Route path="/strategy" element={<Index initialPage="strategy" />} />
          <Route path="/strategy-guide" element={<Index initialPage="strategy" />} />
          <Route path="/help" element={<Index initialPage="help" />} />
          <Route path="/contact" element={<Index initialPage="contact" />} />
          <Route path="/contact-us" element={<Index initialPage="contact" />} />
          <Route path="/terms" element={<Index initialPage="terms" />} />
          <Route path="/privacy" element={<Index initialPage="privacy" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
