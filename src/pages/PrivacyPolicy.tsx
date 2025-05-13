import React, { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const PrivacyPolicy = () => {
  const { t, isRTL } = useLanguage();
  const lastUpdated = "2025-05-15"; // Format: YYYY-MM-DD

  // Set document title
  useEffect(() => {
    document.title = `${t("privacy.title")} | RentCar`;
  }, [t]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className={`text-${isRTL ? "right" : "left"}`}>
              <h1 className="text-3xl font-bold mb-2">{t("privacy.title")}</h1>
              <p className="text-gray-500 mb-6">
                {t("privacy.last_updated", { date: new Date(lastUpdated).toLocaleDateString() })}
              </p>

              <div className="prose max-w-none dark:prose-invert">
                <p className="mb-6">{t("privacy.intro")}</p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">{t("privacy.collection.title")}</h2>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>{t("privacy.collection.personal")}</li>
                  <li>{t("privacy.collection.payment")}</li>
                  <li>{t("privacy.collection.usage")}</li>
                  <li>{t("privacy.collection.device")}</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-8 mb-4">{t("privacy.use.title")}</h2>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>{t("privacy.use.provide")}</li>
                  <li>{t("privacy.use.process")}</li>
                  <li>{t("privacy.use.communicate")}</li>
                  <li>{t("privacy.use.personalize")}</li>
                  <li>{t("privacy.use.improve")}</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-8 mb-4">{t("privacy.sharing.title")}</h2>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>{t("privacy.sharing.providers")}</li>
                  <li>{t("privacy.sharing.partners")}</li>
                  <li>{t("privacy.sharing.legal")}</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-8 mb-4">{t("privacy.security.title")}</h2>
                <p className="mb-6">{t("privacy.security.measures")}</p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">{t("privacy.cookies.title")}</h2>
                <p className="mb-6">{t("privacy.cookies.usage")}</p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">{t("privacy.rights.title")}</h2>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>{t("privacy.rights.access")}</li>
                  <li>{t("privacy.rights.correction")}</li>
                  <li>{t("privacy.rights.deletion")}</li>
                  <li>{t("privacy.rights.restriction")}</li>
                  <li>{t("privacy.rights.objection")}</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-8 mb-4">{t("privacy.changes.title")}</h2>
                <p className="mb-6">{t("privacy.changes.updates")}</p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">{t("privacy.contact.title")}</h2>
                <p className="mb-6">{t("privacy.contact.questions")}</p>
                <p className="mb-6">
                  <strong>Email:</strong> privacy@rentcar.com<br />
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

export default PrivacyPolicy;
