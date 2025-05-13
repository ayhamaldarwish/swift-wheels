import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requireAdmin?: boolean;
}

/**
 * ProtectedRoute component
 * 
 * Protects routes that require authentication, specific permissions, or admin role
 * Redirects to login page if the user doesn't have the required access
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermission,
  requireAdmin = false
}) => {
  const { isAuthenticated, hasPermission, isAdmin } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated) {
    toast({
      title: t("auth.access.denied"),
      description: t("auth.access.login_required"),
      variant: "destructive",
    });
    
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check if admin role is required
  if (requireAdmin && !isAdmin) {
    toast({
      title: t("auth.access.denied"),
      description: t("auth.access.admin_required"),
      variant: "destructive",
    });
    
    return <Navigate to="/" replace />;
  }

  // Check if specific permission is required
  if (requiredPermission && !hasPermission(requiredPermission)) {
    toast({
      title: t("auth.access.denied"),
      description: t("auth.access.permission_required"),
      variant: "destructive",
    });
    
    return <Navigate to="/" replace />;
  }

  // User has the required access, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
