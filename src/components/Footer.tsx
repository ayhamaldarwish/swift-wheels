
import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t, isRTL } = useLanguage();

  return (
    <footer className="bg-secondary text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <Link to="/" className="text-2xl font-bold mb-4 block">
              <span className="text-white">{t("footer.brand.first")}</span>
              <span className="text-primary">{t("footer.brand.second")}</span>
            </Link>
            <p className="text-gray-300 text-sm mb-4">
              {t("footer.about.desc")}
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className={`text-lg font-semibold mb-4 ${isRTL ? "text-right" : "text-left"}`}>{t("footer.quick.title")}</h3>
            <ul className={`space-y-2 ${isRTL ? "text-right" : "text-left"}`}>
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary">
                  {t("footer.quick.home")}
                </Link>
              </li>
              <li>
                <Link to="/cars" className="text-gray-300 hover:text-primary">
                  {t("footer.quick.cars")}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-primary">
                  {t("footer.quick.about")}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-primary">
                  {t("footer.quick.contact")}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-primary">
                  {t("footer.quick.faq")}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-primary">
                  {t("footer.quick.privacy")}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-primary">
                  {t("footer.quick.terms")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-1">
            <h3 className={`text-lg font-semibold mb-4 ${isRTL ? "text-right" : "text-left"}`}>{t("footer.categories.title")}</h3>
            <ul className={`space-y-2 ${isRTL ? "text-right" : "text-left"}`}>
              <li>
                <Link to="/cars?category=Economy" className="text-gray-300 hover:text-primary">
                  {t("home.categories.economy")}
                </Link>
              </li>
              <li>
                <Link to="/cars?category=Sedan" className="text-gray-300 hover:text-primary">
                  {t("home.categories.sedan")}
                </Link>
              </li>
              <li>
                <Link to="/cars?category=SUV" className="text-gray-300 hover:text-primary">
                  {t("home.categories.suv")}
                </Link>
              </li>
              <li>
                <Link to="/cars?category=Luxury" className="text-gray-300 hover:text-primary">
                  {t("home.categories.luxury")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-1">
            <h3 className={`text-lg font-semibold mb-4 ${isRTL ? "text-right" : "text-left"}`}>{t("footer.contact.title")}</h3>
            <ul className={`space-y-2 ${isRTL ? "text-right" : "text-left"}`}>
              <li className={`text-gray-300 flex items-center ${isRTL ? "justify-end space-x-2" : "justify-start space-x-2"}`}>
                <span>{t("footer.contact.address")}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-primary ${isRTL ? "ml-2" : "mr-2"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </li>
              <li className={`text-gray-300 flex items-center ${isRTL ? "justify-end space-x-2" : "justify-start space-x-2"}`}>
                <span dir="ltr">{t("footer.contact.phone")}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-primary ${isRTL ? "ml-2" : "mr-2"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </li>
              <li className={`text-gray-300 flex items-center ${isRTL ? "justify-end space-x-2" : "justify-start space-x-2"}`}>
                <span dir="ltr">{t("footer.contact.email")}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-primary ${isRTL ? "ml-2" : "mr-2"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">{t("footer.copyright", { year: new Date().getFullYear() })}</p>
          <div className={`flex ${isRTL ? "space-x-4" : "space-x-4"} mt-4 md:mt-0`}>
            <a href="#" className="text-gray-400 hover:text-primary" aria-label="Facebook">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-primary" aria-label="Twitter">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.014 10.014 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-primary" aria-label="GitHub">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-primary" aria-label="Instagram">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
