import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Check, AlertCircle } from "lucide-react";

interface EmailConfirmationProps {
  userEmail: string;
  onSendEmail: () => Promise<{ success: boolean; message: string }>;
  onSkip: () => void;
}

const EmailConfirmation: React.FC<EmailConfirmationProps> = ({
  userEmail,
  onSendEmail,
  onSkip,
}) => {
  const { t } = useLanguage();
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savePreference, setSavePreference] = useState(true);

  const handleSendEmail = async () => {
    setIsSending(true);
    setIsSuccess(null);
    setErrorMessage(null);

    try {
      const result = await onSendEmail();
      setIsSuccess(result.success);
      if (!result.success) {
        setErrorMessage(result.message);
      }

      // Save user preference if successful and checkbox is checked
      if (result.success && savePreference) {
        localStorage.setItem("emailConfirmationPreference", "true");
      }
    } catch (error) {
      setIsSuccess(false);
      setErrorMessage(t("email.error.generic"));
    } finally {
      setIsSending(false);
    }
  };

  const handleSkip = () => {
    // Save preference if checkbox is checked
    if (savePreference) {
      localStorage.setItem("emailConfirmationPreference", "false");
    }
    onSkip();
  };

  return (
    <div className="p-6 bg-card text-card-foreground rounded-lg shadow-sm">
      <div className="flex items-center mb-4">
        <Mail className="h-6 w-6 text-primary mr-2" />
        <h3 className="text-xl font-bold">{t("email.confirmation.title")}</h3>
      </div>

      <p className="mb-4 text-muted-foreground">
        {t("email.confirmation.desc")}
      </p>

      <div className="bg-muted p-3 rounded-md mb-4 flex items-center">
        <Mail className="h-5 w-5 text-muted-foreground mr-2" />
        <span className="font-medium">{userEmail}</span>
      </div>

      {isSuccess === true && (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-3 rounded-md mb-4 flex items-center">
          <Check className="h-5 w-5 mr-2" />
          <span>{t("email.confirmation.success")}</span>
        </div>
      )}

      {isSuccess === false && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{errorMessage || t("email.confirmation.error")}</span>
        </div>
      )}

      <div className="flex items-center space-x-2 mb-6">
        <Checkbox
          id="save-preference"
          checked={savePreference}
          onCheckedChange={(checked) => setSavePreference(checked as boolean)}
        />
        <label
          htmlFor="save-preference"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {t("email.confirmation.remember")}
        </label>
      </div>

      <div className="flex space-x-3">
        <Button
          onClick={handleSendEmail}
          disabled={isSending || isSuccess === true}
          className="bg-primary text-secondary hover:bg-primary/90 flex-1"
        >
          {isSending
            ? t("email.confirmation.sending")
            : isSuccess === true
            ? t("email.confirmation.sent")
            : t("email.confirmation.send")}
        </Button>
        <Button
          variant="outline"
          onClick={handleSkip}
          disabled={isSending}
          className="flex-1"
        >
          {t("email.confirmation.skip")}
        </Button>
      </div>
    </div>
  );
};

export default EmailConfirmation;
