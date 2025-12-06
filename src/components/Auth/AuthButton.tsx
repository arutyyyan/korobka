import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import { Loader2, LogIn, LogOut, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button, type ButtonProps } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const authSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Минимум 6 символов"),
});

type AuthFormValues = z.infer<typeof authSchema>;
type Mode = "signin" | "signup";

type Props = {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
  fullWidth?: boolean;
};

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6 1.54 7.38 2.83l5.42-5.42C33.64 3.54 29.44 2 24 2 14.82 2 7.03 7.76 3.7 15.5l6.93 5.38C12.56 14.95 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.5 24.5c0-1.57-.14-3.08-.4-4.5H24v9h12.7c-.55 2.9-2.23 5.36-4.76 7.02l7.49 5.82C43.96 38.62 46.5 32.1 46.5 24.5z"
    />
    <path
      fill="#FBBC05"
      d="M10.63 28.12a14.5 14.5 0 0 1 0-8.24l-6.93-5.38A23.94 23.94 0 0 0 2 24c0 3.87.93 7.53 2.7 10.75l6.93-5.38z"
    />
    <path
      fill="#34A853"
      d="M24 46c6.48 0 11.91-2.14 15.88-5.83l-7.49-5.82c-2.09 1.4-4.78 2.25-8.39 2.25-6.26 0-11.44-4.45-13.33-10.44l-6.93 5.38C7.03 40.24 14.82 46 24 46z"
    />
    <path fill="none" d="M2 2h44v44H2z" />
  </svg>
);

const AuthButton = ({ className, variant = "outline", size = "sm", fullWidth }: Props) => {
  const { toast } = useToast();
  const { user, loading, signIn, signUp, signOut, signInWithGoogle, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("signin");
  const [submitting, setSubmitting] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle redirect after successful sign in
  useEffect(() => {
    if (shouldRedirect && user && !loading) {
      setShouldRedirect(false);
      setDialogOpen(false);
      // Small delay to ensure auth state is fully updated
      setTimeout(() => {
        if (isAdmin) {
          navigate("/admin", { replace: true });
        } else {
          navigate("/learn", { replace: true });
        }
      }, 100);
    }
  }, [shouldRedirect, user, loading, isAdmin, navigate]);

  const handleEmailAuth = async (values: AuthFormValues) => {
    setSubmitting(true);
    const action = mode === "signin" ? signIn : signUp;
    const error = await action(values.email, values.password);
    setSubmitting(false);

    if (error) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (mode === "signin") {
      toast({ title: "Добро пожаловать!", description: "Вы успешно вошли в аккаунт." });
      setShouldRedirect(true);
      // Redirect will be handled by useEffect hook
    } else {
      toast({
        title: "Почти готово",
        description: "Мы отправили письмо для подтверждения email.",
      });
    }
    form.reset();
  };

  const handleGoogleAuth = async () => {
    setSubmitting(true);
    const error = await signInWithGoogle();
    setSubmitting(false);

    if (error) {
      toast({
        title: "Не удалось подключить Google",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Перенаправляем...",
      description: "Секунда — и вы окажетесь в аккаунте Google.",
    });
  };

  const handleSignOut = async () => {
    const error = await signOut();
    if (error) {
      toast({
        title: "Не удалось выйти",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({ title: "До встречи!", description: "Вы вышли из аккаунта." });
  };

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={cn("gap-2", fullWidth && "w-full", className)}
            disabled={loading}
          >
            <UserRound className="h-4 w-4" />
            <span className="truncate max-w-[140px]">{user.email}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs">В аккаунте</span>
            <span className="font-medium truncate">{user.email}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Подписка активна
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-destructive">
            <LogOut className="h-4 w-4" />
            Выйти
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn("gap-2", fullWidth && "w-full", className)}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
          Войти
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Вход или регистрация</DialogTitle>
          <DialogDescription>Используйте email или авторизуйтесь через Google.</DialogDescription>
        </DialogHeader>

        <Tabs value={mode} onValueChange={(value) => setMode(value as Mode)} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Войти</TabsTrigger>
            <TabsTrigger value="signup">Регистрация</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <EmailForm
              form={form}
              onSubmit={handleEmailAuth}
              pending={submitting}
              submitLabel="Войти"
              helper="Введите данные аккаунта, чтобы продолжить."
            />
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <EmailForm
              form={form}
              onSubmit={handleEmailAuth}
              pending={submitting}
              submitLabel="Создать аккаунт"
              helper="Мы отправим подтверждение на указанную почту."
            />
          </TabsContent>
        </Tabs>

        <div className="space-y-4">
          <Separator />
          <Button type="button" variant="outline" className="w-full gap-2" onClick={handleGoogleAuth} disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
            Продолжить через Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

type EmailFormProps = {
  form: UseFormReturn<AuthFormValues>;
  onSubmit: (values: AuthFormValues) => Promise<void>;
  pending: boolean;
  submitLabel: string;
  helper: string;
};

const EmailForm = ({ form, onSubmit, pending, helper, submitLabel }: EmailFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" autoComplete="email" {...field} />
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
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" autoComplete="current-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <p className="text-xs text-muted-foreground flex items-center gap-2">
          <Mail className="h-3.5 w-3.5" />
          {helper}
        </p>

        <Button type="submit" className="w-full gap-2" disabled={pending}>
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </form>
    </Form>
  );
};

export default AuthButton;

