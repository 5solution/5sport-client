"use client";

import { useTranslations } from "next-intl";
import { Menu, LogOut, User } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

interface MobileNavProps {
  onOpenAuth: (tab: "login" | "register") => void;
  user?: { displayName?: string; name?: string; email?: string; avatarUrl?: string; image?: string } | null;
  onSignOut: () => void;
}

export function MobileNav({ onOpenAuth, user, onSignOut }: MobileNavProps) {
  const t = useTranslations("nav");

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/events", label: t("tournaments") },
    { href: "/clubs", label: t("clubs") },
    { href: "/groups", label: t("groups") },
  ];

  const displayName =
    (user && "displayName" in user ? user.displayName : undefined) ??
    (user && "name" in user ? user.name : undefined) ??
    user?.email ??
    "User";

  const avatarSrc =
    (user && "avatarUrl" in user ? user.avatarUrl : undefined) ??
    (user && "image" in user ? user.image : undefined);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-600 hover:bg-slate-100"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-1.5 text-left">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <span className="text-xs font-extrabold text-white">5</span>
            </div>
            <span className="text-lg font-extrabold text-secondary">SPORT</span>
          </SheetTitle>
        </SheetHeader>

        {user && (
          <div className="mt-4 flex items-center gap-3 px-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatarSrc ?? undefined} />
              <AvatarFallback className="bg-primary/10 text-sm font-bold text-primary">
                {displayName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{displayName}</p>
              {user.email && (
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              )}
            </div>
          </div>
        )}

        <Separator className="my-4" />
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Separator className="my-4" />
        <div className="flex flex-col gap-2 px-4">
          {user ? (
            <>
              <Button variant="outline" className="w-full justify-start gap-2">
                <User className="h-4 w-4" />
                {t("profile")}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-destructive"
                onClick={onSignOut}
              >
                <LogOut className="h-4 w-4" />
                {t("logout")}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onOpenAuth("login")}
              >
                {t("login")}
              </Button>
              <Button
                className="w-full bg-primary text-white hover:bg-primary/90"
                onClick={() => onOpenAuth("register")}
              >
                {t("register")}
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
