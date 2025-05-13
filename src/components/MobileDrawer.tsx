import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useCompare } from "@/contexts/CompareContext";
import {
  FaUser,
  FaShieldAlt,
  FaChartBar,
  FaHeart,
  FaTachometerAlt,
  FaGlobe,
  FaTimes,
  FaHome,
  FaCar,
  FaInfoCircle,
  FaEnvelope,
  FaQuestionCircle,
  FaMoon,
  FaSun,
  FaLaptop,
  FaBookOpen
} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const { language, toggleLanguage, t, isRTL } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const { carsToCompare } = useCompare();
  const location = useLocation();

  // We're removing the auto-close on route change
  // to keep the drawer open when navigating

  // Close drawer when escape key is pressed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scrolling when drawer is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      // Restore body scrolling when drawer is closed
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  // Navigation links
  const navLinks = [
    { to: "/", label: t("app.home"), icon: <FaHome className="h-5 w-5" /> },
    { to: "/cars", label: t("app.cars"), icon: <FaCar className="h-5 w-5" /> },
    { to: "/about", label: t("app.about"), icon: <FaInfoCircle className="h-5 w-5" /> },
    { to: "/contact", label: t("app.contact"), icon: <FaEnvelope className="h-5 w-5" /> },
    { to: "/faq", label: t("app.faq"), icon: <FaQuestionCircle className="h-5 w-5" /> },
    { to: "/guide", label: t("app.guide"), icon: null },
  ];

  // Action links
  const actionLinks = [
    {
      to: "/compare",
      label: t("compare.title"),
      icon: <FaChartBar className="h-5 w-5" />,
      badge: carsToCompare.length > 0 ? carsToCompare.length : null,
      show: true
    },
    {
      to: "/favorites",
      label: t("app.favorites"),
      icon: <FaHeart className="h-5 w-5 text-red-500" />,
      show: isAuthenticated
    },
    {
      to: "/dashboard",
      label: t("app.dashboard"),
      icon: <FaTachometerAlt className="h-5 w-5" />,
      show: isAuthenticated
    },
    {
      to: "/admin",
      label: t("app.admin"),
      icon: <FaShieldAlt className="h-5 w-5" />,
      show: isAuthenticated && isAdmin
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: isRTL ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? "-100%" : "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed top-0 bottom-0 w-[85%] max-w-[320px] bg-background shadow-xl z-50 overflow-y-auto",
              isRTL ? "right-0 rounded-l-xl" : "left-0 rounded-r-xl"
            )}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-primary">
                  <span className="text-secondary">رينت</span>كار
                </span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={onClose}
              >
                <FaTimes className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation Links */}
            <div className="p-4">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={cn(
                      "flex items-center gap-3 px-4 py-4 rounded-lg transition-colors text-base",
                      location.pathname === link.to
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-200 my-4" />

              {/* Action Links */}
              <div className="space-y-1">
                {actionLinks.filter(link => link.show).map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={cn(
                      "flex items-center gap-3 px-4 py-4 rounded-lg transition-colors relative text-base",
                      location.pathname === link.to
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="absolute top-3 right-3 bg-primary text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                ))}

                {/* Logout Button (only for authenticated users) */}
                {isAuthenticated && (
                  <button
                    onClick={() => {
                      logout();
                      // We still want to close the drawer after logout
                      onClose();
                    }}
                    className="flex items-center gap-3 px-4 py-4 rounded-lg transition-colors w-full text-left text-gray-600 hover:bg-gray-100 text-base"
                  >
                    <FiLogOut className="h-5 w-5" />
                    <span>{t("app.logout")}</span>
                  </button>
                )}
              </div>

              {/* Theme Switcher */}
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 px-4 py-4 mt-4 rounded-lg transition-colors w-full text-left text-gray-600 hover:bg-gray-100 text-base"
              >
                {isDarkMode ? (
                  <FaSun className="h-5 w-5 text-primary" />
                ) : (
                  <FaMoon className="h-5 w-5 text-primary" />
                )}
                <span>{t("app.theme.toggle")}</span>
              </button>

              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-3 px-4 py-4 mt-4 rounded-lg transition-colors w-full text-left text-gray-600 hover:bg-gray-100 text-base"
              >
                <FaGlobe className="h-5 w-5" />
                <span>{language === "ar" ? "English" : "العربية"}</span>
              </button>

              {/* Auth Buttons (only for non-authenticated users) */}
              {!isAuthenticated && (
                <div className="mt-6 space-y-3">
                  <Link to="/login" className="block">
                    <Button variant="outline" className="w-full border-primary text-secondary hover:bg-primary hover:text-secondary h-12 text-base">
                      {t("app.login")}
                    </Button>
                  </Link>
                  <Link to="/register" className="block">
                    <Button className="w-full bg-primary text-secondary hover:bg-primary/90 h-12 text-base">
                      {t("app.register")}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;
