
import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
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
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PinInput from "@/components/ui/pin-input";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || "/";
  const { login, loginWithPin, isAuthenticated } = useAuth();
  const { t, isRTL } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [usePin, setUsePin] = useState(false);
  const [pin, setPin] = useState("");

  // Form schema for password login
  const passwordFormSchema = z.object({
    username: z.string().min(3, { message: t("login.validation.username") }),
    password: z.string().min(6, { message: t("login.validation.password") }),
  });

  // Form schema for PIN login
  const pinFormSchema = z.object({
    username: z.string().min(3, { message: t("login.validation.username") }),
  });

  // Use the appropriate schema based on login method
  const formSchema = usePin ? pinFormSchema : passwordFormSchema;

  const form = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Handle PIN completion
  const handlePinComplete = async (completedPin: string) => {
    setPin(completedPin);

    if (completedPin.length === 4 && form.getValues("username")) {
      await handleLogin(form.getValues("username"), undefined, completedPin);
    }
  };

  // Toggle between PIN and password login
  const toggleLoginMethod = () => {
    setUsePin(!usePin);
    setLoginError(null);
    setPin("");
  };

  // Handle login with either password or PIN
  async function handleLogin(username: string, password?: string, pinCode?: string) {
    try {
      setIsSubmitting(true);
      setLoginError(null);

      let success = false;

      if (usePin && pinCode) {
        // Login with PIN
        success = await loginWithPin(username, pinCode);
        if (!success) {
          setLoginError(t("login.error.pin.invalid"));
        }
      } else if (!usePin && password) {
        // Login with password
        success = await login(username, password);
        if (!success) {
          setLoginError(t("login.error.invalid"));
        }
      } else {
        setLoginError(usePin ? t("login.validation.pin") : t("login.validation.password"));
        return;
      }

      if (success) {
        navigate(from);
      }
    } catch (error) {
      setLoginError(t("login.error.unexpected"));
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Form submission handler
  async function onSubmit(values: any) {
    if (usePin) {
      await handleLogin(values.username, undefined, pin);
    } else {
      await handleLogin(values.username, values.password);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">{t("login.title")}</h1>
              <p className="text-muted-foreground mt-1">{t("login.subtitle")}</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("login.username")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("login.username.placeholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!usePin ? (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("login.password")}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder={t("login.password.placeholder")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormItem>
                    <FormLabel>{t("login.pin")}</FormLabel>
                    <PinInput
                      length={4}
                      onComplete={handlePinComplete}
                      onChange={setPin}
                      autoFocus
                      error={loginError && loginError.includes("PIN") ? loginError : undefined}
                    />
                  </FormItem>
                )}

                {loginError && !loginError.includes("PIN") && (
                  <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm mb-3">
                    {loginError}
                  </div>
                )}

                <div className="flex flex-col space-y-3">
                  <Button
                    type="submit"
                    className="bg-primary text-secondary hover:bg-primary/90 w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t("login.loading") : t("login.button")}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={toggleLoginMethod}
                  >
                    {usePin ? t("login.use.password") : t("login.use.pin")}
                  </Button>
                </div>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {t("login.register")}{" "}
                <Link to="/register" className="text-primary font-medium hover:underline">
                  {t("login.register.link")}
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

export default Login;
