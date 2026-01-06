import { useLocation, useNavigate, NavLink } from "react-router-dom";
import {
  BookOpen,
  LayoutGrid,
  Users,
  Compass,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import logoBox from "@/assets/logo-box.png";
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

type NavItem = {
  label: string;
  icon: LucideIcon;
  path: string;
  disabled?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Обзор", icon: LayoutGrid, path: "/admin" },
  { label: "Курсы", icon: BookOpen, path: "/admin/courses" },
  { label: "Направления", icon: Compass, path: "/admin/directions" },
  { label: "Группы курсов", icon: Layers, path: "/admin/course-groups" },
  { label: "Студенты", icon: Users, path: "/admin/students", disabled: true },
];

const AdminSidebar = () => {
  const { user, signOut, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    // Вызываем signOut - он всегда сбрасывает состояние, даже при ошибке
    await signOut();

    // ЖЁСТКИЙ RESET - принудительно обновляем профиль и перенаправляем
    await refreshProfile();
    navigate("/", { replace: true });

    toast({ title: "До встречи!", description: "Вы вышли из аккаунта." });
  };

  const getInitials = (email: string | undefined) => {
    if (!email) return "A";
    return email.charAt(0).toUpperCase();
  };

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const handleNavigate = (item: NavItem) => {
    if (item.disabled) {
      return;
    }
    if (item.path === location.pathname) {
      return;
    }
    navigate(item.path);
  };

  return (
    <aside
      className="flex flex-col h-full"
      style={{ backgroundColor: "#F8FAFC" }}
    >
      {/* Logo at top */}
      <div className="p-6 border-b border-border/40">
        <NavLink to="/admin" className="flex items-center gap-3">
          <img src={logoBox} alt="Коробка" className="h-8 w-8" />
          <span className="text-xl font-bold text-foreground">Korobka</span>
        </NavLink>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                type="button"
                key={item.label}
                onClick={() => handleNavigate(item)}
                disabled={item.disabled}
                className={cn(
                  "w-full text-left transition-all border-b border-border/30 px-4 py-4 rounded-lg",
                  active
                    ? "bg-primary/10 border-l-[3px] border-l-primary font-semibold text-foreground"
                    : "hover:bg-gray-50/50 text-foreground",
                  item.disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      active ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <span className="text-base">{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Avatar dropdown at bottom */}
      <div className="px-6 py-4 border-t border-border/40">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 rounded-lg hover:bg-gray-50/50 p-2 transition-colors outline-none focus:outline-none">
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage
                    src={user.user_metadata?.avatar_url}
                    alt={user.email || "Admin"}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-xs text-muted-foreground truncate">
                    Администратор
                  </p>
                  <p className="text-sm font-medium truncate">{user.email}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs">
                  Администратор
                </span>
                <span className="font-medium truncate">{user.email}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Права администратора
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate("/admin/profile/settings")}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Настройки
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
        ) : null}
      </div>
    </aside>
  );
};

export default AdminSidebar;
