import { NavLink } from "react-router-dom";
import logoBox from "@/assets/logo-box.png";
import AuthButton from "@/components/Auth/AuthButton";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, ShieldCheck, Settings, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { generateTelegramLinkToken, getTelegramLinkUrl } from "@/api/telegram";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const PlatformHeader = () => {
  const { user, signOut, isAdmin, profile, isPro, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [connectingTelegram, setConnectingTelegram] = useState(false);
  const [telegramDialogOpen, setTelegramDialogOpen] = useState(false);

  const handleSignOut = async () => {
    // Вызываем signOut - он всегда сбрасывает состояние, даже при ошибке
    await signOut();

    // ЖЁСТКИЙ RESET - принудительно обновляем профиль и перенаправляем
    await refreshProfile();
    navigate("/", { replace: true });

    toast({ title: "До встречи!", description: "Вы вышли из аккаунта." });
  };

  const handleConnectTelegram = () => {
    setTelegramDialogOpen(true);
  };

  const handleConfirmTelegramConnection = async () => {
    if (connectingTelegram) return;

    setTelegramDialogOpen(false);
    setConnectingTelegram(true);
    try {
      const token = await generateTelegramLinkToken();
      const telegramUrl = getTelegramLinkUrl(token);
      window.open(telegramUrl, "_blank", "noopener,noreferrer");

      // Poll for profile update after a short delay
      setTimeout(() => {
        let attempts = 0;
        const maxAttempts = 15; // Try for 30 seconds (15 attempts * 2 seconds)
        const pollInterval = 2000; // 2 seconds

        const poll = setInterval(async () => {
          attempts++;
          await refreshProfile();

          if (attempts >= maxAttempts) {
            clearInterval(poll);
          }
        }, pollInterval);
      }, 3000); // Start polling 3 seconds after opening Telegram
    } catch (error) {
      console.error("Failed to generate Telegram link", error);
      toast({
        title: "Ошибка",
        description:
          error instanceof Error
            ? error.message
            : "Не удалось создать ссылку для подключения",
        variant: "destructive",
      });
    } finally {
      setConnectingTelegram(false);
    }
  };

  const getInitials = (email: string | undefined) => {
    if (!email) return "U";
    return email.charAt(0).toUpperCase();
  };

  const isTelegramConnected = Boolean(profile?.telegram_user_id);

  return (
    <header className="sticky top-0 z-50 w-full bg-white flex-shrink-0">
      <div className="w-full px-6 border-b border-border/40">
        <div className="flex h-12 items-center justify-between">
          {/* Logo and Navigation Links Grouped Together */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <NavLink to="/learn" className="flex items-center gap-3">
              <img src={logoBox} alt="Коробка" className="h-8 w-8" />
              <span className="text-xl font-bold text-foreground">Korobka</span>
            </NavLink>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 h-full">
              <NavLink
                to="/learn"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors h-full flex items-center relative ${
                    isActive
                      ? "text-primary after:absolute after:-bottom-[15px] after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`
                }
              >
                Мое обучение
              </NavLink>
              {/* <NavLink
                to="/courses"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors h-full flex items-center relative ${
                    isActive
                      ? "text-primary after:absolute after:-bottom-[15px] after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`
                }
              >
                Все курсы
              </NavLink> */}
              {isAdmin && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors h-full flex items-center relative ${
                      isActive
                        ? "text-primary after:absolute after:-bottom-[15px] after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`
                  }
                >
                  Админ
                </NavLink>
              )}
            </nav>
          </div>

          {/* Profile */}
          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="outline-none focus:outline-none">
                    <Avatar className="h-8 w-8 cursor-pointer">
                      <AvatarImage
                        src={user.user_metadata?.avatar_url}
                        alt={user.email || "User"}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(user.email)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-xs">
                      В аккаунте
                    </span>
                    <span className="font-medium truncate">{user.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center gap-2 text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    {isPro ? "Подписка активна" : "Подписка не активна"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate("/profile/settings")}
                    className="flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Настройки
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleConnectTelegram}
                    disabled={connectingTelegram || isTelegramConnected}
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    {isTelegramConnected
                      ? "Telegram подключен"
                      : connectingTelegram
                      ? "Подключение..."
                      : "Подключить Telegram"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <AuthButton />
            )}
          </div>
        </div>
      </div>

      {/* Telegram Connection Dialog */}
      <Dialog open={telegramDialogOpen} onOpenChange={setTelegramDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подключение Telegram</DialogTitle>
            <DialogDescription>
              После перехода в Telegram бот нажмите кнопку Start, чтобы
              завершить привязку аккаунта.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={handleConfirmTelegramConnection}
              disabled={connectingTelegram}
            >
              {connectingTelegram ? "Подключение..." : "Перейти в Telegram"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default PlatformHeader;
