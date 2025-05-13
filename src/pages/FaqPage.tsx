import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FaqAccordion, { FaqSection } from "@/components/FaqAccordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Mail, Phone, MessageCircleQuestion } from "lucide-react";

/**
 * FaqPage component
 * 
 * Displays frequently asked questions organized by categories
 */
const FaqPage: React.FC = () => {
  const { t, isRTL } = useLanguage();

  // Create FAQ sections with items
  const faqSections: FaqSection[] = [
    {
      title: t("faq.sections.general.title"),
      items: [
        {
          question: t("faq.sections.general.q1"),
          answer: t("faq.sections.general.a1"),
        },
        {
          question: t("faq.sections.general.q2"),
          answer: t("faq.sections.general.a2"),
        },
        {
          question: t("faq.sections.general.q3"),
          answer: t("faq.sections.general.a3"),
        },
        {
          question: t("faq.sections.general.q4"),
          answer: t("faq.sections.general.a4"),
        },
      ],
    },
    {
      title: t("faq.sections.booking.title"),
      items: [
        {
          question: t("faq.sections.booking.q1"),
          answer: t("faq.sections.booking.a1"),
        },
        {
          question: t("faq.sections.booking.q2"),
          answer: t("faq.sections.booking.a2"),
        },
        {
          question: t("faq.sections.booking.q3"),
          answer: t("faq.sections.booking.a3"),
        },
        {
          question: t("faq.sections.booking.q4"),
          answer: t("faq.sections.booking.a4"),
        },
      ],
    },
    {
      title: t("faq.sections.payment.title"),
      items: [
        {
          question: t("faq.sections.payment.q1"),
          answer: t("faq.sections.payment.a1"),
        },
        {
          question: t("faq.sections.payment.q2"),
          answer: t("faq.sections.payment.a2"),
        },
        {
          question: t("faq.sections.payment.q3"),
          answer: t("faq.sections.payment.a3"),
        },
      ],
    },
    {
      title: t("faq.sections.policies.title"),
      items: [
        {
          question: t("faq.sections.policies.q1"),
          answer: t("faq.sections.policies.a1"),
        },
        {
          question: t("faq.sections.policies.q2"),
          answer: t("faq.sections.policies.a2"),
        },
        {
          question: t("faq.sections.policies.q3"),
          answer: t("faq.sections.policies.a3"),
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {t("faq.title")}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("faq.subtitle")}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto mb-16">
          <FaqAccordion sections={faqSections} />
        </div>

        {/* Still Have Questions Section */}
        <div className="bg-muted rounded-lg p-8 text-center max-w-3xl mx-auto">
          <MessageCircleQuestion className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">
            {t("faq.more.title")}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t("faq.more.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" className="gap-2">
              <Link to="/contact">
                <Mail className="h-4 w-4" />
                {t("faq.more.contact")}
              </Link>
            </Button>
            <Button asChild className="gap-2">
              <a href="tel:+966123456789">
                <Phone className="h-4 w-4" />
                {t("faq.more.call")}
              </a>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FaqPage;
