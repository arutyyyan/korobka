import { NavLink } from "react-router-dom";
import logoBox from "@/assets/logo-box.png";
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
import { useToast } from "@/hooks/use-toast";

const AdminHeader = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

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
    if (!email) return "A";
    return email.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white flex-shrink-0">
      <div className="w-full px-6 border-b border-border/40">
        <div className="flex h-12 items-center justify-between">
          {/* Logo and Navigation Links Grouped Together */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <NavLink to="/admin" className="flex items-center gap-3">
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
                Платформа
              </NavLink>
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
                Админ-панель
              </NavLink>
            </nav>
          </div>

          {/* Profile */}
          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="outline-none focus:outline-none">
                    <Avatar className="h-8 w-8 cursor-pointer">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || "Admin"} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(user.email)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-xs">Администратор</span>
                    <span className="font-medium truncate">{user.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center gap-2 text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    Права администратора
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-destructive">
                    <LogOut className="h-4 w-4" />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

