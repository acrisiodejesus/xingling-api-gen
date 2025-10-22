"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Database, LogOut, Languages } from "lucide-react";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { user, signOut } = useAuth();
  const t = useTranslations("header");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: "en" | "pt") => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Database className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">{t("title")}</span>
        </Link>

        <nav className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Languages className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => switchLocale("pt")}>
                🇧🇷 Português
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchLocale("en")}>
                🇺🇸 English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost">{t("dashboard")}</Button>
              </Link>
              <Button variant="ghost" onClick={() => signOut()}>
                <LogOut className="h-4 w-4 mr-2" />
                {t("logout")}
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">{t("login")}</Button>
              </Link>
              <Link href="/register">
                <Button>{t("register")}</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
