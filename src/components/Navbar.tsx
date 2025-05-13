
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useCompare } from "@/contexts/CompareContext";
// Import from React Icons instead of Lucide
import { FaUser, FaShieldAlt, FaChartBar, FaHeart, FaTachometerAlt, FaGlobe, FaBars, FaMoon, FaSun, FaLaptop, FaBookOpen } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import MobileDrawer from "./MobileDrawer";

const Navbar = () => {
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const { language, toggleLanguage, t, isRTL } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const { carsToCompare } = useCompare();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <nav className="bg-background py-4 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 ml-6">
          <span className="text-2xl font-bold text-primary">
            <span className="text-secondary">رينت</span>كار
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-primary font-medium ml-6">
            {t("app.home")}
          </Link>
          <Link to="/cars" className="text-gray-600 hover:text-primary font-medium ml-6">
            {t("app.cars")}
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-primary font-medium ml-6">
            {t("app.about")}
          </Link>
          <Link to="/contact" className="text-gray-600 hover:text-primary font-medium ml-6">
            {t("app.contact")}
          </Link>
          <Link to="/faq" className="text-gray-600 hover:text-primary font-medium ml-6">
            {t("app.faq")}
          </Link>
          <Link to="/guide" className="text-gray-600 hover:text-primary font-medium ml-6">
            {t("app.guide")}
          </Link>
        </div>

        {/* Auth Buttons and Language Switcher */}
        <div className="hidden md:flex items-center">
          {/* All Icons in a single group with equal spacing */}
          <div className="flex items-center" style={{ gap: '12px' }}>
            {/* Compare Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/compare" className="relative">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full h-10 w-10 border-input hover:bg-accent hover:text-accent-foreground"
                      aria-label={t("compare.title")}
                    >
                      <FaChartBar className="h-5 w-5 text-primary" />
                      {carsToCompare.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {carsToCompare.length}
                        </span>
                      )}
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  {t("compare.title")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Favorites Button - Only for authenticated users */}
            {isAuthenticated && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/favorites" className="relative">
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full h-10 w-10 border-input hover:bg-accent hover:text-accent-foreground"
                        aria-label={t("favorites.title")}
                      >
                        <FaHeart className="h-5 w-5 text-red-500" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    {t("app.favorites")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}



            {/* Theme Switcher */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleTheme}
                    className="rounded-full h-10 w-10 border-input hover:bg-accent hover:text-accent-foreground"
                    aria-label={t("app.theme.toggle")}
                  >
                    {isDarkMode ? (
                      <FaSun className="h-5 w-5 text-primary" />
                    ) : (
                      <FaMoon className="h-5 w-5 text-primary" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {t("app.theme.toggle")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Language Switcher */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center justify-center h-10 w-10 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    aria-label={language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
                  >
                    <FaGlobe className="h-5 w-5 text-primary" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {isAuthenticated && (
              <>
                {/* Dashboard Icon */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/dashboard" className="relative">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full h-10 w-10 border-input hover:bg-accent hover:text-accent-foreground"
                          aria-label={t("app.dashboard")}
                        >
                          <FaTachometerAlt className="h-5 w-5 text-primary" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      {t("app.dashboard")}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Admin Icon - Only for admins */}
                {isAdmin && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link to="/admin" className="relative">
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full h-10 w-10 border-input hover:bg-accent hover:text-accent-foreground"
                            aria-label={t("app.admin")}
                          >
                            <FaShieldAlt className="h-5 w-5 text-primary" />
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        {t("app.admin")}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                {/* Logout Icon */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={logout}
                        variant="outline"
                        size="icon"
                        className="rounded-full h-10 w-10 border-input hover:bg-accent hover:text-accent-foreground"
                        aria-label={t("app.logout")}
                      >
                        <FiLogOut className="h-5 w-5 text-gray-600" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {t("app.logout")}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}
          </div>

          {!isAuthenticated && (
            <div className="flex items-center ml-3 space-x-3">
              <Link to="/login">
                <Button variant="outline" className="border-primary text-secondary hover:bg-primary hover:text-secondary transition">
                  {t("app.login")}
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-primary text-secondary hover:bg-primary/90">
                  {t("app.register")}
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600 hover:text-primary"
          onClick={() => setDrawerOpen(true)}
          aria-label={t("app.menu")}
        >
          <FaBars className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </nav>
  );
};

export default Navbar;
