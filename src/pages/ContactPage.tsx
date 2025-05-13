
import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SuccessNotification } from "@/components/ui/success-notification";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoogleMap from "@/components/GoogleMap";
import SimpleMap from "@/components/SimpleMap";
import { useLanguage } from "@/contexts/LanguageContext";

const ContactPage = () => {
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [useSimpleMap, setUseSimpleMap] = useState(false);
  const [savedMessages, setSavedMessages] = useState<any[]>(() => {
    // Load saved messages from localStorage if available
    const saved = localStorage.getItem('contactMessages');
    return saved ? JSON.parse(saved) : [];
  });

  const formSchema = z.object({
    name: z.string().min(2, { message: t("contact.form.validation.name") }),
    email: z.string().email({ message: t("contact.form.validation.email") }),
    phone: z.string().min(9, { message: t("contact.form.validation.phone") }),
    messageType: z.string({
      required_error: t("contact.form.validation.messageType"),
    }),
    subject: z.string().min(5, { message: t("contact.form.validation.subject") }),
    message: z.string().min(10, { message: t("contact.form.validation.message") }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      messageType: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      setFormSuccess(false);
      setShowNotification(false);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Save message to localStorage
      const newMessage = {
        ...values,
        id: `msg-${Date.now()}`,
        date: new Date().toISOString(),
        status: 'unread'
      };

      const updatedMessages = [newMessage, ...savedMessages];
      localStorage.setItem('contactMessages', JSON.stringify(updatedMessages));
      setSavedMessages(updatedMessages);

      console.log('Message saved:', newMessage);

      // Show success message
      toast({
        title: t("contact.toast.success.title"),
        description: t("contact.toast.success.desc"),
        variant: "default",
      });

      // Reset form and update success state
      form.reset();
      setFormSuccess(true);
      setShowNotification(true);
    } catch (error) {
      console.error("Contact form error:", error);
      toast({
        title: t("contact.toast.error.title"),
        description: t("contact.toast.error.desc"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gray-900 text-white py-20">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-50 "
            style={{ backgroundImage: "url('/images/car-1.jpg')" }}
          ></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("contact.hero.title")}</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              {t("contact.hero.subtitle")}
            </p>
          </div>
        </section>

        {/* Contact Info & Form */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h2 className="text-3xl font-bold mb-6">{t("contact.info.title")}</h2>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div className={`${isRTL ? "mr-4" : "ml-4"}`}>
                      <h3 className="font-bold mb-1">{t("contact.info.address.title")}</h3>
                      <p className="text-gray-600">
                        {t("contact.info.address.value")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div className={`${isRTL ? "mr-4" : "ml-4"}`}>
                      <h3 className="font-bold mb-1">{t("contact.info.phone.title")}</h3>
                      <p className="text-gray-600 mb-1" dir="ltr">+966 123 456 789</p>
                      <p className="text-gray-600" dir="ltr">+966 987 654 321</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div className={`${isRTL ? "mr-4" : "ml-4"}`}>
                      <h3 className="font-bold mb-1">{t("contact.info.email.title")}</h3>
                      <p className="text-gray-600 mb-1" dir="ltr">info@rentcar.com</p>
                      <p className="text-gray-600" dir="ltr">support@rentcar.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div className={`${isRTL ? "mr-4" : "ml-4"}`}>
                      <h3 className="font-bold mb-1">{t("contact.info.workingHours.title")}</h3>
                      <p className="text-gray-600 mb-1">{t("contact.info.workingHours.value.sat-thu")}</p>
                      <p className="text-gray-600">{t("contact.info.workingHours.value.fri")}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-bold text-xl mb-4">{t("contact.info.follow")}</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors">
                      <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                      </svg>
                    </a>
                    <a href="#" className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors">
                      <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.014 10.014 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
                      </svg>
                    </a>
                    <a href="#" className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors">
                      <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                    </a>
                    <a href="#" className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors">
                      <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold mb-6">{t("contact.form.title")}</h2>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("contact.form.name")}</FormLabel>
                              <FormControl>
                                <Input placeholder={t("contact.form.name.placeholder")} {...field} />
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
                              <FormLabel>{t("contact.form.email")}</FormLabel>
                              <FormControl>
                                <Input placeholder={t("contact.form.email.placeholder")} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("contact.form.phone")}</FormLabel>
                              <FormControl>
                                <Input placeholder={t("contact.form.phone.placeholder")} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="messageType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("contact.form.messageType")}</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={t("contact.form.messageType.placeholder")} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="inquiry">{t("contact.form.messageType.inquiry")}</SelectItem>
                                  <SelectItem value="feedback">{t("contact.form.messageType.feedback")}</SelectItem>
                                  <SelectItem value="complaint">{t("contact.form.messageType.complaint")}</SelectItem>
                                  <SelectItem value="suggestion">{t("contact.form.messageType.suggestion")}</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("contact.form.subject")}</FormLabel>
                            <FormControl>
                              <Input placeholder={t("contact.form.subject.placeholder")} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("contact.form.message")}</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={t("contact.form.message.placeholder")}
                                className="min-h-32"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {formSuccess && (
                        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md mb-4">
                          <div className="flex items-center">
                            <svg className="h-5 w-5 text-green-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="font-medium">{t("contact.toast.success.title")}</span>
                          </div>
                          <p className="mt-1 text-sm">{t("contact.toast.success.desc")}</p>
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="bg-primary text-secondary hover:bg-primary/90 w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t("contact.form.submit.loading")}
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Send className="h-4 w-4" />
                            {t("contact.form.submit.text")}
                          </span>
                        )}
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">{t("contact.map.title")}</h2>
              <Button
                variant="outline"
                onClick={() => setUseSimpleMap(!useSimpleMap)}
                className="bg-primary/10 hover:bg-primary/20 border-primary/20"
              >
                {useSimpleMap ? "استخدم خريطة جوجل" : "استخدم الخريطة البسيطة"}
              </Button>
            </div>

            {useSimpleMap ? (
              <SimpleMap
                address={t("contact.info.address.value")}
                officeName={t("contact.map.office")}
                className="w-full"
              />
            ) : (
              <GoogleMap
                address={t("contact.info.address.value")}
                officeName={t("contact.map.office")}
                className="w-full"
              />
            )}
          </div>
        </section>

        {/* Success Notification */}
        {showNotification && (
          <SuccessNotification
            title={t("contact.toast.success.title")}
            message={t("contact.toast.success.desc")}
            open={showNotification}
            onClose={() => setShowNotification(false)}
            duration={6000}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
