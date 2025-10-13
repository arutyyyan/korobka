import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logoBox from "@/assets/logo-box.png";
import { getBotUrl } from "@/lib/utils";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    // отправляем событие в Яндекс.Метрику
    if (window.ym) {
      // window.ym(104427792, "reachGoal", "click_access");
    }
    // открываем Telegram-бот
    window.open(getBotUrl(), "_blank");
    setIsOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const navItems = [
    { label: "Курсы", id: "courses" },
    { label: "Цены", id: "pricing" },
    { label: "FAQ", id: "faq" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src={logoBox}
              alt="Коробка"
              className="h-8 w-8"
            />
            <span className="text-xl font-bold gradient-text">
              Коробка
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
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
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
              >
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
                  <img
                    src={logoBox}
                    alt="Коробка"
                    className="h-8 w-8"
                  />
                  <span className="text-xl font-bold gradient-text">
                    Коробка
                  </span>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex flex-col gap-6 mb-8">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="text-left text-lg font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>

                {/* Mobile CTA */}
                <div className="mt-auto">
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


