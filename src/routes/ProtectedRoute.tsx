import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const { user, loading, profile } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Redirect to onboarding if not completed
  if (profile && !profile.onboarding_completed && location.pathname !== "/onboarding") {
    // Allow access to /onboarding, but redirect /learn to onboarding
    if (location.pathname.startsWith("/learn")) {
      return <Navigate to="/onboarding" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;

