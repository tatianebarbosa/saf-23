import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AccessControl from "@/components/auth/AccessControl";


// Lazy loading dos componentes
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CanvaDashboard = lazy(() => import("@/components/canva/CanvaDashboard"));
const CanvaCostCalculator = lazy(() => import("@/components/canva/CanvaCostCalculator"));
const CanvaLicenseControl = lazy(() => import("@/components/canva/CanvaLicenseControl"));
const CanvaLicenseManager = lazy(() => import("@/components/canva/CanvaLicenseManager"));
const CoordinatorDashboard = lazy(() => import("@/components/coordinator/CoordinatorDashboard"));
const SchoolVoucherControl = lazy(() => import("@/components/vouchers/SchoolVoucherControl"));
const VoucherDashboard = lazy(() => import("@/components/vouchers/VoucherDashboard"));
const VoucherUnitManager = lazy(() => import("@/components/vouchers/VoucherUnitManager"));
const Voucher2026Dashboard = lazy(() => import("@/components/vouchers/Voucher2026Dashboard"));
const InsightsAnalytics = lazy(() => import("@/components/insights/InsightsAnalytics"));
const CanvaInsightsPage = lazy(() => import("./pages/CanvaInsightsPage"));
const MonitoringPortal = lazy(() => import("@/components/monitoring/MonitoringPortal"));
const AuditPanel = lazy(() => import("@/components/monitoring/AuditPanel"));
const TicketsPage = lazy(() => import("./pages/TicketsPage"));
const MonitoringPage = lazy(() => import("./pages/MonitoringPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const SAFCalendar = lazy(() => import("@/components/calendar/SAFCalendar"));
const CanvaRanking = lazy(() => import("@/components/canva/CanvaRanking"));
const CanvaCostAnalysis = lazy(() => import("@/components/canva/CanvaCostAnalysis"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
    },
  },
});

// Componente de loading
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

import { TicketProvider } from "./context/TicketContext";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <TicketProvider>
            <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/canva" 
              element={
                <ProtectedRoute>
                  <CanvaDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/canva-licenses" 
              element={
                <ProtectedRoute>
                  <CanvaLicenseControl />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/canva-manager" 
              element={
                <ProtectedRoute>
                  <CanvaLicenseManager />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/canva-costs" 
              element={
                <ProtectedRoute>
                  <CanvaCostCalculator />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/vouchers-school" 
              element={
                <ProtectedRoute>
                  <SchoolVoucherControl />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/coordinator" 
              element={
                <ProtectedRoute>
                  <CoordinatorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/vouchers" 
              element={
                <ProtectedRoute>
                  <VoucherDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/vouchers-units" 
              element={
                <ProtectedRoute>
                  <VoucherUnitManager />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/vouchers-2026" 
              element={
                <ProtectedRoute>
                  <Voucher2026Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/canva-insights" 
              element={
                <ProtectedRoute>
                  <CanvaInsightsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/monitoring" 
              element={
                <ProtectedRoute>
                  <MonitoringPortal />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/audit" 
              element={
                <ProtectedRoute>
                  <AuditPanel />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tickets" 
              element={
                <ProtectedRoute>
                  <TicketsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/calendar" 
              element={
                <ProtectedRoute>
                  <SAFCalendar />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/canva-ranking" 
              element={
                <ProtectedRoute>
                  <CanvaRanking />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/canva-cost-analysis" 
              element={
                <ProtectedRoute>
                  <CanvaCostAnalysis />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/access-control" 
              element={<AccessControl />} 
            />
            <Route 
              path="/" 
              element={<Navigate to="/login" replace />} 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </TicketProvider>
        </Suspense>

      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
