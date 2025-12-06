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
import { LogOut, ShieldCheck, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const PlatformHeader = () => {
  const { user, signOut, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const getInitials = (email: string | undefined) => {
    if (!email) return "U";
    return email.charAt(0).toUpperCase();
  };

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
              <NavLink
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
              </NavLink>
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
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || "User"} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(user.email)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
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
                  <DropdownMenuItem 
                    onClick={() => navigate("/profile/settings")} 
                    className="flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Настройки
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-destructive">
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
    </header>
  );
};

export default PlatformHeader;

