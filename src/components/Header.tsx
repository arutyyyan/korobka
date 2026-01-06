import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logoBox from "@/assets/logo-box.png";
import { getBotUrl } from "@/lib/utils";
import AuthButton from "@/components/Auth/AuthButton";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

type NavItem =
  | {
      label: string;
      type: "section";
      id: string;
    }
  | {
      label: string;
      type: "route";
      path: string;
    };

const navItems: NavItem[] = [
  { label: "Главная", type: "route", path: "/" },
  { label: "Каталог курсов", type: "route", path: "/courses" },
  { label: "Курсы", type: "section", id: "courses" },
  { label: "Цены", type: "section", id: "pricing" },
  { label: "FAQ", type: "section", id: "faq" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    window.open(getBotUrl(), "_blank");
    setIsOpen(false);
  };

  const handleSectionNavigation = (sectionId: string) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { sectionId } });
      setIsOpen(false);
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const renderNavItem = (item: NavItem, variant: "desktop" | "mobile") => {
    const baseStyles =
      variant === "desktop"
        ? "text-sm font-medium transition-colors"
        : "text-left text-lg font-medium transition-colors py-2";

    if (item.type === "route") {
      return (
        <NavLink
          key={item.label}
          to={item.path}
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            [
              baseStyles,
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-primary",
            ].join(" ")
          }
        >
          {item.label}
        </NavLink>
      );
    }

    return (
      <button
        key={item.id}
        onClick={() => handleSectionNavigation(item.id)}
        className={`${baseStyles} text-muted-foreground hover:text-primary`}
      >
        {item.label}
      </button>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logoBox} alt="Коробка" className="h-8 w-8" />
            <span className="text-xl font-bold gradient-text">Коробка</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => renderNavItem(item, "desktop"))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <AuthButton />
            <Button
              variant="hero"
              size="sm"
              onClick={handleClick}
              className="text-sm px-4 py-2"
            >
              Получить доступ
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <span className="sr-only">Открыть меню</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                {/* Mobile Logo */}
                <div className="flex items-center gap-3 mb-8">
                  <img src={logoBox} alt="Коробка" className="h-8 w-8" />
                  <span className="text-xl font-bold gradient-text">
                    Коробка
                  </span>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex flex-col gap-6 mb-8">
                  {navItems.map((item) => renderNavItem(item, "mobile"))}
                </nav>

                {/* Mobile CTA */}
                <div className="mt-auto">
                  {/* <AuthButton variant="outline" size="lg" fullWidth className="mb-3" /> */}
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={handleClick}
                    className="w-full text-base py-3"
                  >
                    Получить доступ
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Отменить можно в любой момент
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
