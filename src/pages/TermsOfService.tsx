import React, { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const TermsOfService = () => {
  const { t, isRTL } = useLanguage();
  const lastUpdated = "2025-05-15"; // Format: YYYY-MM-DD

  // Set document title
  useEffect(() => {
    document.title = `${t("terms.title")} | RentCar`;
  }, [t]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className={`text-${isRTL ? "right" : "left"}`}>
              <h1 className="text-3xl font-bold mb-2">{t("terms.title")}</h1>
              <p className="text-gray-500 mb-6">
                {t("terms.last_updated", { date: new Date(lastUpdated).toLocaleDateString() })}
              </p>

              <div className="prose max-w-none dark:prose-invert">
                <p className="mb-6">{t("terms.intro")}</p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">{t("terms.acceptance.title")}</h2>
                <p className="mb-6">{t("terms.acceptance.agree")}</p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">{t("terms.account.title")}</h2>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>{t("terms.account.responsible")}</li>
                  <li>{t("terms.account.accurate")}</li>
                  <li>{t("terms.account.age")}</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-8 mb-4">{t("terms.booking.title")}</h2>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>{t("terms.booking.confirmation")}</li>
                  <li>{t("terms.booking.modification")}</li>
                  <li>{t("terms.booking.requirements")}</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-8 mb-4">{t("terms.payment.title")}</h2>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>{t("terms.payment.rates")}</li>
                  <li>{t("terms.payment.additional")}</li>
                  <li>{t("terms.payment.methods")}</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-8 mb-4">{t("terms.liability.title")}</h2>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>{t("terms.liability.limit")}</li>
                  <li>{t("terms.liability.indirect")}</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-8 mb-4">{t("terms.prohibited.title")}</h2>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>{t("terms.prohibited.illegal")}</li>
                  <li>{t("terms.prohibited.interfere")}</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-8 mb-4">{t("terms.termination.title")}</h2>
                <p className="mb-6">{t("terms.termination.right")}</p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">{t("terms.changes.title")}</h2>
                <p className="mb-6">{t("terms.changes.updates")}</p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">{t("terms.contact.title")}</h2>
                <p className="mb-6">{t("terms.contact.questions")}</p>
                <p className="mb-6">
                  <strong>Email:</strong> legal@rentcar.com<br />
                  <strong>{t("footer.contact.address")}</strong>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
