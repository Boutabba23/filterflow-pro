import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Engins from "./pages/Engins";
import Filtres from "./pages/Filtres";
import Configuration from "./pages/Configuration";
import NotFound from "./pages/NotFound";
import EnginDetails from "./pages/EnginDetails";
import { ErrorBoundary } from "./components/ErrorBoundary";
import FilterDetails from "./pages/FilterDetails";

const queryClient = new QueryClient();

const App = () => (
<<<<<<< HEAD
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/engins" element={<Engins />} />
            <Route path="/engins/:id" element={<EnginDetails />} />
            <Route path="/filtres" element={<Filtres />} />
            <Route path="/filtres/:id" element={<FilterDetails />} />
            <Route path="/config" element={<Configuration />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
=======
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/engins" element={<Engins />} />
        <Route path="/engins/:id" element={<EnginDetails />} />
        <Route path="/filtres" element={<Filtres />} />
        <Route path="/filtres/:id" element={<FilterDetails />} />
        <Route path="/config" element={<Configuration />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
>>>>>>> a87fe9648a27cc715c1ad5dcd3d4acbd7c996438
);

export default App;
