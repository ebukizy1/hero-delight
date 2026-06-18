import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

// Function to track page view with Meta Pixel
const trackPageView = () => {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", "PageView");
  }
};

// Component to handle route changes and track page views
function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView();
  }, [location]);

  return null;
}
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminGuard } from "@/components/AdminGuard";
import Index from "./pages/Index.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import CategoryPage from "./pages/CategoryPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import AdminAddProduct from "./pages/AdminAddProduct.tsx";
import AdminEditProduct from "./pages/AdminEditProduct.tsx";
import AdminAddArticle from "./pages/AdminAddArticle.tsx";
import AdminEditArticle from "./pages/AdminEditArticle.tsx";
import AdminAddComparison from "./pages/AdminAddComparison.tsx";
import AdminEditComparison from "./pages/AdminEditComparison.tsx";
import ArticleDetail from "./pages/ArticleDetail.tsx";
import ComparisonDetail from "./pages/ComparisonDetail.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PageViewTracker />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
          <Route path="/admin/add-product" element={<AdminGuard><AdminAddProduct /></AdminGuard>} />
          <Route path="/admin/edit-product/:id" element={<AdminGuard><AdminEditProduct /></AdminGuard>} />
          <Route path="/admin/add-article" element={<AdminGuard><AdminAddArticle /></AdminGuard>} />
          <Route path="/admin/edit-article/:slug" element={<AdminGuard><AdminEditArticle /></AdminGuard>} />
          <Route path="/admin/add-comparison" element={<AdminGuard><AdminAddComparison /></AdminGuard>} />
          <Route path="/admin/edit-comparison/:slug" element={<AdminGuard><AdminEditComparison /></AdminGuard>} />
          <Route path="/article/:slug" element={<ArticleDetail />} />
          <Route path="/comparison/:slug" element={<ComparisonDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
