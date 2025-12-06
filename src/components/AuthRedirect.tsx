import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

const AuthRedirect = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect if still loading or no user
    if (loading || !user) {
      return;
    }

    // Only redirect from public pages (home, privacy, terms, refund)
    const publicPages = ["/", "/privacy", "/terms", "/refund"];
    const isOnPublicPage = publicPages.includes(location.pathname);

    // Don't redirect if already on an authenticated page
    const isOnAuthPage = 
      location.pathname.startsWith("/learn") ||
      location.pathname.startsWith("/admin") ||
      location.pathname.startsWith("/profile") ||
      location.pathname === "/courses";

    // Only redirect if on a public page
    if (isOnPublicPage && !isOnAuthPage) {
      // Redirect based on admin status
      if (isAdmin) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/learn", { replace: true });
      }
    }
  }, [user, loading, isAdmin, navigate, location.pathname]);

  return null;
};

export default AuthRedirect;

