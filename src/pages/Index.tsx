
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Section } from "@/components/ui/section";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import Logo from "@/components/Logo";
import TestimonialGrid from "@/components/TestimonialGrid";
import BudgetCarSuggestion from "@/components/BudgetCarSuggestion";
import PopularCarsSection from "@/components/PopularCarsSection";
import RandomCarSuggestion from "@/components/RandomCarSuggestion";
import SpecialOfferBanner from "@/components/SpecialOfferBanner";
import InfoWidgets from "@/components/widgets/InfoWidgets";
import BannerDemo from "@/components/BannerDemo";
import { useBanner } from "@/contexts/BannerContext";
import { cars } from "@/data/cars";
import { testimonials } from "@/data/testimonials";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const navigate = useNavigate();
  const { t, language, isRTL } = useLanguage();
  const { showBanner } = useBanner();
  const [searchQuery, setSearchQuery] = useState("");
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);

  // Create a date 3 days from now for the special offer end date
  const [specialOfferEndDate] = useState(() => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 3);
    return endDate;
  });

  // Get featured cars (using the highest rated ones)
  const featuredCars = [...cars]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  // Auto-rotate testimonials
  // Show a new car banner when the component mounts
  useEffect(() => {
    // Show a banner for a new car
    showBanner({
      message: t("banner.new_car").replace("{car}", "Mercedes S500"),
      type: "announcement",
      action: {
        label: t("banner.view_details"),
        onClick: () => {
          // Navigate to car details
          navigate("/cars/1");
        },
      },
      id: "new-car-banner",
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cars?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />

      {/* Welcome Banner */}
      {showWelcomeBanner && (
        <div className="bg-primary/10 border-b border-primary/20">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <Logo size="sm" className={isRTL ? "ml-2" : "mr-2"} />
              <p className="text-sm text-primary">
                {t("home.welcome.message")}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <InfoWidgets city="Riyadh" className="hidden md:flex" />
              <button
                onClick={() => setShowWelcomeBanner(false)}
                className="text-muted-foreground hover:text-foreground"
                aria-label={t("home.welcome.close")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-50">
          <OptimizedImage
            src="/images/hero.jpg"
            alt={t("home.hero.background.alt")}
            containerClassName="h-full w-full"
            loadingStrategy="eager"
            showSkeleton={false}
          />
        </div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Logo size="xl" className="mx-auto mb-8" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("home.hero.title")}</h1>
            <p className="text-lg md:text-xl mb-8">{t("home.hero.subtitle")}</p>

            <form onSubmit={handleSearch} className="flex max-w-md mx-auto mb-8">
              <Input
                type="text"
                placeholder={t("home.hero.search")}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 rounded-r-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button className="bg-primary text-secondary hover:bg-primary/90 rounded-l-none">
                {t("home.hero.search.button")}
              </Button>
            </form>

            <AnimatedButton
              animationType="scale"
              className="bg-primary text-secondary hover:bg-primary/90 mt-4 px-8 py-6 text-lg"
              onClick={() => navigate('/cars')}
            >
              {t("home.hero.explore")}
            </AnimatedButton>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t("home.categories.title")}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Economy */}
            <Link
              to="/cars?category=Economy"
              className="rounded-lg overflow-hidden shadow-md bg-card text-card-foreground hover:shadow-lg transition-shadow group relative"
            >
              <div className="h-40 bg-gray-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10"></div>
                <OptimizedImage
                  src="/images/car-1.jpg"
                  alt={t("home.categories.economy")}
                  containerClassName="h-full w-full"
                  className="group-hover:scale-105 transition-transform"
                  loadingStrategy="lazy"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-bold mb-2">{t("home.categories.economy")}</h3>
                <p className="text-sm text-muted-foreground">{t("home.categories.economy.desc")}</p>
              </div>
            </Link>

            {/* Sedan */}
            <Link
              to="/cars?category=Sedan"
              className="rounded-lg overflow-hidden shadow-md bg-card text-card-foreground hover:shadow-lg transition-shadow group relative"
            >
              <div className="h-40 bg-gray-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10"></div>
                <OptimizedImage
                  src="/images/car-2.jpg"
                  alt={t("home.categories.sedan")}
                  containerClassName="h-full w-full"
                  className="group-hover:scale-105 transition-transform"
                  loadingStrategy="lazy"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-bold mb-2">{t("home.categories.sedan")}</h3>
                <p className="text-sm text-muted-foreground">{t("home.categories.sedan.desc")}</p>
              </div>
            </Link>

            {/* SUV */}
            <Link
              to="/cars?category=SUV"
              className="rounded-lg overflow-hidden shadow-md bg-card text-card-foreground hover:shadow-lg transition-shadow group relative"
            >
              <div className="h-40 bg-gray-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10"></div>
                <OptimizedImage
                  src="/images/car-5.jpg"
                  alt={t("home.categories.suv")}
                  containerClassName="h-full w-full"
                  className="group-hover:scale-105 transition-transform"
                  loadingStrategy="lazy"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-bold mb-2">{t("home.categories.suv")}</h3>
                <p className="text-sm text-muted-foreground">{t("home.categories.suv.desc")}</p>
              </div>
            </Link>

            {/* Luxury */}
            <Link
              to="/cars?category=Luxury"
              className="rounded-lg overflow-hidden shadow-md bg-card text-card-foreground hover:shadow-lg transition-shadow group relative"
            >
              <div className="h-40 bg-gray-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10"></div>
                <OptimizedImage
                  src="/images/car-4.jpg"
                  alt={t("home.categories.luxury")}
                  containerClassName="h-full w-full"
                  className="group-hover:scale-105 transition-transform"
                  loadingStrategy="lazy"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-bold mb-2">{t("home.categories.luxury")}</h3>
                <p className="text-sm text-muted-foreground">{t("home.categories.luxury.desc")}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Special Offer Countdown Section */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <SpecialOfferBanner
            endDate={specialOfferEndDate}
            ctaUrl="/cars?category=Luxury"
            ctaText={t("cars.view_all")}
            onExpire={() => console.log("Special offer has expired")}
            className="shadow-lg"
          />
        </div>
      </section>

      {/* Budget Car Suggestion Section */}
      <BudgetCarSuggestion />

      {/* Featured Cars Section */}
      <Section
        title={t("home.featured.title")}
        action={
          <Link to="/cars">
            <AnimatedButton
              variant="outline"
              animationType="scale"
              className="border-input text-card-foreground hover:bg-accent hover:text-accent-foreground"
            >
              {t("home.featured.viewall")}
            </AnimatedButton>
          </Link>
        }
        background="card"
        spacing="default"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </Section>

      {/* Popular Cars Section */}
      <PopularCarsSection limit={4} />

      {/* Random Car Suggestion Section */}
      <RandomCarSuggestion />

      {/* Testimonials Section */}
      <Section
        title={t("home.testimonials.title")}
        subtitle={t("home.testimonials.subtitle")}
        background="card"
        spacing="default"
        headerClassName="text-center mb-8"
        contentClassName="container mx-auto"
      >
        <TestimonialGrid testimonials={testimonials} />
      </Section>

      {/* Why Choose Us */}
      <Section
        title={t("home.why.title")}
        background="card"
        spacing="default"
        headerClassName="text-center mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-lg">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">{t("home.why.prices")}</h3>
            <p className="text-muted-foreground">{t("home.why.prices.desc")}</p>
          </div>

          <div className="text-center p-6 rounded-lg">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">{t("home.why.reliable")}</h3>
            <p className="text-muted-foreground">{t("home.why.reliable.desc")}</p>
          </div>

          <div className="text-center p-6 rounded-lg">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">{t("home.why.support")}</h3>
            <p className="text-muted-foreground">{t("home.why.support.desc")}</p>
          </div>
        </div>
      </Section>

      {/* Call to Action */}
      <div className="relative bg-secondary text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 18C11.9941 18 12.9584 17.7931 13.8134 17.391C14.6684 16.989 15.3861 16.3997 15.9048 15.6775C16.4235 14.9553 16.7259 14.1182 16.7829 13.2497C16.8399 12.3812 16.6499 11.5147 16.2308 10.7381C15.8116 9.96144 15.1764 9.30191 14.3934 8.82459C13.6104 8.34727 12.7103 8.06898 11.7834 8.01352C10.8566 7.95806 9.93089 8.12735 9.09641 8.50647C8.26193 8.88559 7.54451 9.46068 7.01 10.17L11 18ZM11 18L3 18M11 18L11 26" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <Section
          spacing="default"
          className="text-white"
          contentClassName="text-center"
        >
          <div className="max-w-4xl mx-auto bg-secondary/80 backdrop-blur-sm p-8 rounded-xl border border-white/10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("home.cta.title")}</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">{t("home.cta.desc")}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/cars">
                <AnimatedButton
                  className="bg-primary text-secondary hover:bg-primary/90 px-8 py-3 text-lg"
                  animationType="shine"
                >
                  {t("home.cta.button")}
                </AnimatedButton>
              </Link>
              <Link to="/guide">
                <AnimatedButton
                  className="bg-secondary border border-primary text-primary hover:bg-primary/10 px-8 py-3 text-lg"
                  animationType="pulse"
                >
                  {t("app.guide")}
                </AnimatedButton>
              </Link>
              <Link to="/contact">
                <AnimatedButton
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg"
                  animationType="scale"
                >
                  {t("home.contact.button")}
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </Section>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
