import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AdminLayout from "@/components/admin/AdminLayout";
import { useLocation } from "react-router-dom";

const passwordSchema = z
  .object({
    currentPassword: z.string().optional(),
    newPassword: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

const ProfileSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Check if user has a password provider
  useEffect(() => {
    const checkPasswordProvider = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        
        // Check if user has email provider (which means they have a password)
        const hasEmailProvider = data.user.identities?.some(identity => identity.provider === "email");
        setHasPassword(hasEmailProvider ?? false);
      } catch (error) {
        console.error("Error checking password provider:", error);
        setHasPassword(false);
      }
    };
    
    checkPasswordProvider();
  }, [user]);

  const handleSubmit = async (values: PasswordFormValues) => {
    if (!user) {
      toast({
        title: "Ошибка",
        description: "Вы не авторизованы",
        variant: "destructive",
      });
      return;
    }

    // Validate current password is provided if user has a password
    if (hasPassword && !values.currentPassword) {
      form.setError("currentPassword", {
        type: "manual",
        message: "Введите текущий пароль",
      });
      return;
    }

    setIsLoading(true);

    try {
      // If user has a password, we need to verify current password first
      if (hasPassword && values.currentPassword) {
        // Verify current password by attempting to sign in
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: user.email!,
          password: values.currentPassword,
        });

        if (signInError) {
          form.setError("currentPassword", {
            type: "manual",
            message: "Неверный текущий пароль",
          });
          setIsLoading(false);
          return;
        }
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: values.newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Пароль обновлён",
        description: hasPassword 
          ? "Ваш пароль успешно изменён." 
          : "Пароль успешно установлен. Теперь вы можете входить с помощью email и пароля.",
      });

      form.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // If user didn't have a password before, update the state
      if (!hasPassword) {
        setHasPassword(true);
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось обновить пароль",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const content = (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Настройки профиля</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Управление паролем и настройками аккаунта
          </p>
        </div>
      </div>

      <div className="rounded-2xl border bg-background p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Информация об аккаунте</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-muted-foreground">Способ входа</span>
              <span className="font-medium">
                {hasPassword === null 
                  ? "Проверка..." 
                  : hasPassword 
                  ? "Email и пароль" 
                  : user?.app_metadata?.provider === "google" 
                  ? "Google" 
                  : "OAuth"}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-2">
            {hasPassword ? "Изменить пароль" : "Установить пароль"}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            {hasPassword
              ? "Введите текущий пароль и новый пароль для изменения."
              : "Установите пароль, чтобы иметь возможность входить с помощью email и пароля."}
          </p>

          {hasPassword === false && (
            <Alert className="mb-6">
              <AlertDescription>
                Вы вошли через {user?.app_metadata?.provider === "google" ? "Google" : "OAuth"}. 
                Установите пароль, чтобы иметь возможность входить с помощью email и пароля.
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {hasPassword && (
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Текущий пароль</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Введите текущий пароль"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{hasPassword ? "Новый пароль" : "Пароль"}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          placeholder={hasPassword ? "Введите новый пароль" : "Введите пароль"}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Минимум 8 символов
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Подтвердите пароль</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Повторите пароль"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    navigate(-1);
                  }}
                >
                  Отмена
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Сохранение...
                    </>
                  ) : hasPassword ? (
                    "Изменить пароль"
                  ) : (
                    "Установить пароль"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );

  if (isAdmin) {
    return (
      <AdminLayout
        title="Настройки профиля"
        description="Управление паролем и настройками аккаунта"
      >
        {content}
      </AdminLayout>
    );
  }

  // For regular users, content is rendered inside PlatformLayout via route Outlet
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide p-6">
      <div className="max-w-3xl mx-auto">
        {content}
      </div>
    </div>
  );
};

export default ProfileSettings;

