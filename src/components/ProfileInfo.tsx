import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, User, Mail, Key, AlertTriangle } from "lucide-react";

const ProfileInfo: React.FC = () => {
  const { user, updateUserInfo, updatePassword, deleteAccount, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  // Form schemas
  const profileFormSchema = z.object({
    name: z.string().min(2, { message: t("register.validation.name") }),
    email: z.string().email({ message: t("register.validation.email") }),
  });

  const passwordFormSchema = z.object({
    currentPassword: z.string().min(6, { message: t("login.validation.password") }),
    newPassword: z.string().min(6, { message: t("login.validation.password") }),
    confirmPassword: z.string().min(6, { message: t("login.validation.password") }),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: t("profile.password.error.match"),
    path: ["confirmPassword"],
  });

  // Form hooks
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Loading states
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Handle profile update
  const onProfileSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    setIsUpdatingProfile(true);
    try {
      const success = await updateUserInfo(values.name, values.email);
      if (success) {
        // Form was already reset by the toast in the context
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle password update
  const onPasswordSubmit = async (values: z.infer<typeof passwordFormSchema>) => {
    setIsUpdatingPassword(true);
    try {
      const success = await updatePassword(values.currentPassword, values.newPassword);
      if (success) {
        passwordForm.reset();
      }
    } catch (error) {
      console.error("Error updating password:", error);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const success = await deleteAccount(deletePassword);
      if (success) {
        setIsDeleteDialogOpen(false);
        navigate("/");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>{t("auth.access.login_required")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t("profile.personal_info")}</h2>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="info">{t("profile.personal_info")}</TabsTrigger>
          <TabsTrigger value="security">{t("profile.update_password")}</TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>{t("profile.update_info")}</CardTitle>
              <CardDescription>{t("profile.update_info.desc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("profile.name")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" placeholder={t("register.name.placeholder")} {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("profile.email")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" placeholder={t("register.email.placeholder")} {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center space-x-2 mt-2">
                    <FormLabel className="text-sm">{t("profile.role")}</FormLabel>
                    <Badge variant={user.role === "admin" ? "default" : "outline"}>
                      {user.role === "admin" ? t("profile.role.admin") : t("profile.role.user")}
                    </Badge>
                  </div>

                  <Button type="submit" className="w-full" disabled={isUpdatingProfile}>
                    {isUpdatingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t("profile.update_info")}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-destructive">{t("profile.delete_account")}</CardTitle>
              <CardDescription>{t("profile.delete_account.desc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {t("profile.delete_account.warning")}
              </p>
              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    {t("profile.delete_account")}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("profile.delete_account.confirm")}</DialogTitle>
                    <DialogDescription>
                      {t("profile.delete_account.warning")}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      <p className="text-sm font-medium text-destructive">
                        {t("profile.delete_account.warning")}
                      </p>
                    </div>
                    <Input
                      type="password"
                      placeholder={t("login.password.placeholder")}
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDeleteDialogOpen(false)}
                    >
                      {t("profile.delete_account.cancel")}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={isDeleting || !deletePassword}
                    >
                      {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {t("profile.delete_account.confirm")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>{t("profile.update_password")}</CardTitle>
              <CardDescription>{t("profile.update_password.desc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("profile.current_password")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-10"
                              type="password"
                              placeholder="••••••"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("profile.new_password")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-10"
                              type="password"
                              placeholder="••••••"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("profile.confirm_password")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-10"
                              type="password"
                              placeholder="••••••"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isUpdatingPassword}>
                    {isUpdatingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t("profile.update_password")}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileInfo;
