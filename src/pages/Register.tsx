
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PinInput from "@/components/ui/pin-input";

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, isAuthenticated } = useAuth();
  const { t, isRTL } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [usePin, setUsePin] = useState(false);
  const [pin, setPin] = useState("");

  const formSchema = z.object({
    username: z.string().min(3, { message: t("register.validation.username") }),
    name: z.string().min(2, { message: t("register.validation.name") }),
    email: z.string().email({ message: t("register.validation.email") }),
    password: z.string().min(6, { message: t("register.validation.password") }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
    },
  });

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Handle PIN completion
  const handlePinComplete = (completedPin: string) => {
    setPin(completedPin);
  };

  // Toggle PIN option
  const togglePinOption = () => {
    setUsePin(!usePin);
    setPin("");
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      setRegisterError(null);

      // Validate PIN if PIN option is enabled
      if (usePin && (!pin || pin.length !== 4)) {
        setRegisterError(t("login.validation.pin"));
        setIsSubmitting(false);
        return;
      }

      const success = await registerUser(
        values.username,
        values.name,
        values.email,
        values.password,
        usePin ? pin : undefined
      );

      if (success) {
        navigate("/");
      } else {
        setRegisterError(t("register.error.invalid"));
      }
    } catch (error) {
      setRegisterError(t("register.error.unexpected"));
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">{t("register.title")}</h1>
              <p className="text-muted-foreground mt-1">{t("register.subtitle")}</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("register.username")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("register.username.placeholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("register.name")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("register.name.placeholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("register.email")}</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder={t("register.email.placeholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("register.password")}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder={t("register.password.placeholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Switch
                    id="use-pin"
                    checked={usePin}
                    onCheckedChange={togglePinOption}
                  />
                  <label
                    htmlFor="use-pin"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t("login.use.pin")}
                  </label>
                </div>

                {usePin && (
                  <FormItem>
                    <FormLabel>{t("login.pin")}</FormLabel>
                    <PinInput
                      length={4}
                      onComplete={handlePinComplete}
                      onChange={setPin}
                      error={registerError && registerError.includes("PIN") ? registerError : undefined}
                    />
                    <p className="text-sm text-muted-foreground">
                      {t("login.validation.pin")}
                    </p>
                  </FormItem>
                )}

                {registerError && !registerError.includes("PIN") && (
                  <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                    {registerError}
                  </div>
                )}

                <Button
                  type="submit"
                  className="bg-primary text-secondary hover:bg-primary/90 w-full mt-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t("register.loading") : t("register.button")}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {t("register.login")}{" "}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  {t("register.login.link")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
