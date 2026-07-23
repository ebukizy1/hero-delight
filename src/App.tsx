import { lazy, Suspense, useEffect, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminGuard } from "@/components/AdminGuard";
import { trackPageView } from "@/lib/analytics";
import { fbTrack } from "@/lib/metaPixel";

const Index = lazy(() => import("./pages/Index.tsx"));
const ProductDetail = lazy(() => import("./pages/ProductDetail.tsx"));
const CategoryPage = lazy(() => import("./pages/CategoryPage.tsx"));
const AboutPage = lazy(() => import("./pages/AboutPage.tsx"));
const Checkout = lazy(() => import("./pages/Checkout.tsx"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess.tsx"));
const BlogList = lazy(() => import("./pages/BlogList.tsx"));
const BlogArticle = lazy(() => import("./pages/BlogArticle.tsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.tsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.tsx"));
const AdminAddProduct = lazy(() => import("./pages/AdminAddProduct.tsx"));
const AdminEditProduct = lazy(() => import("./pages/AdminEditProduct.tsx"));
const AdminOrders = lazy(() => import("./pages/AdminOrders.tsx"));
const AdminBlogList = lazy(() => import("./pages/AdminBlogList.tsx"));
const AdminAddArticle = lazy(() => import("./pages/AdminAddArticle.tsx"));
const AdminEditArticle = lazy(() => import("./pages/AdminEditArticle.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);
  return null;
}

function RouteTracker() {
  const { pathname, search } = useLocation();
  const isFirst = useRef(true);
  useEffect(() => {
    // The gtag/fbq base snippets in index.html already report the initial page load —
    // skip it here so the first view isn't double-counted, and only track subsequent
    // in-app (React Router) navigations, which those static snippets can't see.
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    // Defer a tick so document.title (set by the page's <Seo>) is up to date before we report it.
    const id = window.setTimeout(() => {
      trackPageView(pathname + search);
      fbTrack("PageView");
    }, 0);
    return () => window.clearTimeout(id);
  }, [pathname, search]);
  return null;
}

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <RouteTracker />
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="/insights" element={<BlogList />} />
            <Route path="/insights/:slug" element={<BlogArticle />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
            <Route path="/admin/add-product" element={<AdminGuard><AdminAddProduct /></AdminGuard>} />
            <Route path="/admin/edit-product/:id" element={<AdminGuard><AdminEditProduct /></AdminGuard>} />
            <Route path="/admin/orders" element={<AdminGuard><AdminOrders /></AdminGuard>} />
            <Route path="/admin/insights" element={<AdminGuard><AdminBlogList /></AdminGuard>} />
            <Route path="/admin/insights/add" element={<AdminGuard><AdminAddArticle /></AdminGuard>} />
            <Route path="/admin/insights/edit/:id" element={<AdminGuard><AdminEditArticle /></AdminGuard>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
