import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useYandexMetrica } from "@/hooks/use-yandex-metrica";
import Index from "./pages/Index";
import Start from "./pages/Start";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import RefundPolicy from "./pages/RefundPolicy";
import CoursesCatalog from "./pages/CoursesCatalog";
import MyLearning from "./pages/MyLearning";
import CoursePlayer from "./pages/CoursePlayer";
import Onboarding from "./pages/Onboarding";
import { AuthProvider } from "@/contexts/AuthContext";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import CoursesPage from "@/pages/admin/CoursesPage";
import CreateCoursePage from "@/pages/admin/CreateCoursePage";
import CourseDetailsPage from "@/pages/admin/CourseDetailsPage";
import LessonDetailsPage from "@/pages/admin/LessonDetailsPage";
import DirectionsPage from "@/pages/admin/DirectionsPage";
import CourseGroupsPage from "@/pages/admin/CourseGroupsPage";
import ProfileSettings from "@/pages/ProfileSettings";
import AdminRoute from "@/routes/AdminRoute";
import AppLayout from "@/components/layout/AppLayout";
import PlatformLayout from "@/components/layout/PlatformLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import AuthRedirect from "@/components/AuthRedirect";

const queryClient = new QueryClient();

const AppContent = () => {
  useYandexMetrica();

  return (
    <>
      <AuthRedirect />
      <Routes>
      {/* Standalone start page for warm leads */}
      <Route path="/start" element={<Start />} />

        {/* Public routes with landing header */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Index />} />
          <Route path="courses" element={<CoursesCatalog />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsOfService />} />
          <Route path="refund" element={<RefundPolicy />} />
        </Route>

        {/* Onboarding route */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />

        {/* Platform routes (authenticated) with platform header */}
        <Route
          path="/learn"
          element={
            <ProtectedRoute>
              <PlatformLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MyLearning />} />
          <Route path=":courseSlug/:lessonId?" element={<CoursePlayer />} />
        </Route>
        <Route
          path="/profile/settings"
          element={
            <ProtectedRoute>
              <PlatformLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProfileSettings />} />
        </Route>

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <AdminRoute>
              <CoursesPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/courses/new"
          element={
            <AdminRoute>
              <CreateCoursePage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/courses/:courseId"
          element={
            <AdminRoute>
              <CourseDetailsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/courses/:courseId/lessons/:lessonId"
          element={
            <AdminRoute>
              <LessonDetailsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/directions"
          element={
            <AdminRoute>
              <DirectionsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/course-groups"
          element={
            <AdminRoute>
              <CourseGroupsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/profile/settings"
          element={
            <AdminRoute>
              <ProfileSettings />
            </AdminRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
