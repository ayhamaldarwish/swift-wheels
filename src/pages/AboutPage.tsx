
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const AboutPage = () => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gray-900 text-white py-20">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-50"
            style={{ backgroundImage: "url('/images/hero.jpg')" }}
          ></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("about.hero.title")}</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              {t("about.hero.subtitle")}
            </p>
          </div>
        </section>

        {/* About Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">{t("about.story.title")}</h2>
                <p className="text-gray-600 mb-4">
                  {t("about.story.p1")}
                </p>
                <p className="text-gray-600 mb-4">
                  {t("about.story.p2")}
                </p>
                <p className="text-gray-600">
                  {t("about.story.p3")}
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img
                  src="/images/car-1.jpg"
                  alt={t("about.story.image.alt")}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">{t("about.values.title")}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-lg border border-gray-100 shadow-sm">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">{t("about.values.trust.title")}</h3>
                <p className="text-gray-600">
                  {t("about.values.trust.desc")}
                </p>
              </div>

              <div className="text-center p-6 rounded-lg border border-gray-100 shadow-sm">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">{t("about.values.innovation.title")}</h3>
                <p className="text-gray-600">
                  {t("about.values.innovation.desc")}
                </p>
              </div>

              <div className="text-center p-6 rounded-lg border border-gray-100 shadow-sm">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">{t("about.values.customers.title")}</h3>
                <p className="text-gray-600">
                  {t("about.values.customers.desc")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">{t("about.team.title")}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="mb-4 relative w-32 h-32 mx-auto rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1492321936769-b49830bc1d1e"
                    alt="Ayham Aldarwish"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Ayham Aldarwish</h3>
                <p className="text-gray-600">{t("about.team.ceo")}</p>
              </div>

              <div className="text-center">
                <div className="mb-4 relative w-32 h-32 mx-auto rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1493397212122-2b85dda8106b"
                    alt="Amgad Aldarwish"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Amgad Aldarwish</h3>
                <p className="text-gray-600">{t("about.team.operations")}</p>
              </div>

              <div className="text-center">
                <div className="mb-4 relative w-32 h-32 mx-auto rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1466442929976-97f336a657be"
                    alt="Ahmad Aldarwish"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Ahmad Aldarwish</h3>
                <p className="text-gray-600">{t("about.team.marketing")}</p>
              </div>

              <div className="text-center">
                <div className="mb-4 relative w-32 h-32 mx-auto rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1469474968028-56623f02e42e"
                    alt="Agyad Aldarwish"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Agyad Aldarwish</h3>
                <p className="text-gray-600">{t("about.team.customer")}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
