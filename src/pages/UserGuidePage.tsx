import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Link } from "react-router-dom";
import { 
  Car, 
  Search, 
  Calendar, 
  CreditCard, 
  Key, 
  HelpCircle, 
  BookOpen, 
  Info, 
  User, 
  Heart, 
  Star, 
  ShieldCheck,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

/**
 * User Guide Page Component
 * 
 * Provides a comprehensive guide on how to use the website
 */
const UserGuidePage: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  // Guide steps data
  const guideSteps = [
    {
      id: "browse",
      icon: <Car className="h-8 w-8 text-primary" />,
      title: t("guide.steps.browse.title"),
      description: t("guide.steps.browse.description"),
      image: "/images/guide/browse-cars.jpg",
      altImage: "/cars/car-1.jpg"
    },
    {
      id: "search",
      icon: <Search className="h-8 w-8 text-primary" />,
      title: t("guide.steps.search.title"),
      description: t("guide.steps.search.description"),
      image: "/images/guide/search-filter.jpg",
      altImage: "/cars/car-2.jpg"
    },
    {
      id: "book",
      icon: <Calendar className="h-8 w-8 text-primary" />,
      title: t("guide.steps.book.title"),
      description: t("guide.steps.book.description"),
      image: "/images/guide/booking-calendar.jpg",
      altImage: "/cars/car-3.jpg"
    },
    {
      id: "payment",
      icon: <CreditCard className="h-8 w-8 text-primary" />,
      title: t("guide.steps.payment.title"),
      description: t("guide.steps.payment.description"),
      image: "/images/guide/payment.jpg",
      altImage: "/cars/car-4.jpg"
    },
    {
      id: "pickup",
      icon: <Key className="h-8 w-8 text-primary" />,
      title: t("guide.steps.pickup.title"),
      description: t("guide.steps.pickup.description"),
      image: "/images/guide/pickup.jpg",
      altImage: "/cars/car-5.jpg"
    }
  ];

  // Features data
  const features = [
    {
      id: "account",
      icon: <User className="h-6 w-6 text-primary" />,
      title: t("guide.features.account.title"),
      description: t("guide.features.account.description")
    },
    {
      id: "favorites",
      icon: <Heart className="h-6 w-6 text-primary" />,
      title: t("guide.features.favorites.title"),
      description: t("guide.features.favorites.description")
    },
    {
      id: "ratings",
      icon: <Star className="h-6 w-6 text-primary" />,
      title: t("guide.features.ratings.title"),
      description: t("guide.features.ratings.description")
    },
    {
      id: "security",
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: t("guide.features.security.title"),
      description: t("guide.features.security.description")
    }
  ];

  return (
    <>
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t("guide.title")}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            {t("guide.subtitle")}
          </p>
          <div className="inline-block bg-destructive/10 text-destructive px-4 py-2 rounded-md text-sm font-medium">
            <Info className="h-4 w-4 inline-block mr-2" />
            {t("guide.demo_notice")}
          </div>
        </div>

        {/* Guide Steps */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>{t("guide.steps.title")}</CardTitle>
            <CardDescription>{t("guide.steps.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="browse" className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
                {guideSteps.map(step => (
                  <TabsTrigger key={step.id} value={step.id} className="flex items-center gap-2">
                    {step.icon}
                    <span className="hidden md:inline">{step.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {guideSteps.map(step => (
                <TabsContent key={step.id} value={step.id}>
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        {step.icon}
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                      </div>
                      <p className="text-muted-foreground mb-6">{step.description}</p>
                      <Button asChild>
                        <Link to="/cars">
                          {t("guide.try_now")}
                          <ArrowIcon className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    <div className="rounded-lg overflow-hidden border">
                      <OptimizedImage
                        src={step.altImage}
                        alt={step.title}
                        aspectRatio="aspect-video"
                        containerClassName="w-full"
                      />
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Features Section */}
        <h2 className="text-2xl font-bold mb-6">{t("guide.features.title")}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map(feature => (
            <Card key={feature.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {feature.icon}
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Educational Notice */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              {t("guide.educational.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{t("guide.educational.description")}</p>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" asChild>
                <Link to="/about">
                  {t("guide.educational.learn_more")}
                </Link>
              </Button>
              <Button asChild>
                <Link to="/cars">
                  {t("guide.educational.explore")}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </>
  );
};

export default UserGuidePage;
