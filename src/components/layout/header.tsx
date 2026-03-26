"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, ChevronDown } from "lucide-react";
import { LanguageSwitcher } from "./language-switcher";
import { MobileNav } from "./mobile-nav";
import { AuthModal } from "@/components/auth/auth-modal";
import Script from "next/script";
import Image from "next/image";

export function Header() {
  const t = useTranslations("nav");
  const { user, logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/events", label: t("tournaments") },
    // { href: "/clubs", label: t("clubs") },
    // { href: "/groups", label: t("groups") },
    { href: "/group-tickets", label: t("groupTickets") },
  ];

  const openAuth = (tab: "login" | "register") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  const handleSignOut = () => {
    logout();
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-primary">
        <div className="mx-auto flex h-16 max-w-container items-center justify-between px-6 lg:px-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="5Sport" width={48} height={48} className="rounded-lg" priority />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-white/80 transition-colors duration-200 hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="hidden items-center gap-2 md:flex">
            <LanguageSwitcher />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="gap-2 text-white hover:bg-accent/90  hover:text-secondary"
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                        {(user.displayName ?? user.email ?? "U").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="max-w-[100px] truncate text-sm font-medium">
                      {user.displayName ?? user.email ?? "User"}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-white/60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      {t("profile")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  size="sm"
                  className="bg-accent text-sm font-medium text-accent-foreground transition-all duration-200 hover:bg-accent/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary active:scale-95"
                  onClick={() => openAuth("login")}
                >
                  {t("login")}
                </Button>
                <Button
                  size="sm"
                  className="bg-white text-sm font-semibold text-primary shadow-sm transition-all duration-200 hover:bg-white/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary active:scale-95"
                  onClick={() => openAuth("register")}
                >
                  {t("register")}
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <MobileNav onOpenAuth={openAuth} user={user ?? undefined} onSignOut={handleSignOut} />
          </div>
        </div>
      </header>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />

      <div
        className="zalo-chat-widget"
        data-oaid="3527677753749430127"
        data-welcome-message="Bạn cần hỗ trợ, hãy nhắn tin ngay cho tôi!"
        data-autopopup="2"
        data-width="300"
        data-height="300"
      />
      <Script src="https://sp.zalo.me/plugins/sdk.js" strategy="lazyOnload" />
    </>
  );
}
