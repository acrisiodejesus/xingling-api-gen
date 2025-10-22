"use client"

import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Database, Code, Zap, Globe, AlertTriangle, Check } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { isConfigValid } from "@/lib/firebase"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"

export default function Home() {
  const firebaseConfigured = isConfigValid()
  const t = useTranslations("home")

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {!firebaseConfigured && (
          <div className="bg-destructive/10 border-b border-destructive/20">
            <div className="container mx-auto px-4 py-4">
              <Alert variant="destructive" className="bg-transparent border-0">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{t("firebaseWarning.title")}</AlertTitle>
                <AlertDescription>{t("firebaseWarning.description")}</AlertDescription>
              </Alert>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-balance">{t("hero.title")}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto text-pretty">
              {t("hero.subtitle")}
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8">
                  {t("hero.cta")}
                </Button>
              </Link>
              <a href="#pricing">
                <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                  {t("hero.learnMore")}
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{t("features.step1.title")}</h3>
              <p className="text-muted-foreground leading-relaxed">{t("features.step1.description")}</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Database className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">{t("features.step2.title")}</h3>
              <p className="text-muted-foreground leading-relaxed">{t("features.step2.description")}</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{t("features.step3.title")}</h3>
              <p className="text-muted-foreground leading-relaxed">{t("features.step3.description")}</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Globe className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Público</h3>
              <p className="text-muted-foreground leading-relaxed">
                APIs disponíveis publicamente para qualquer um usar.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-center">{t("features.title")}</h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{t("features.step1.title")}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t("features.step1.description")}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{t("features.step2.title")}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t("features.step2.description")}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{t("features.step3.title")}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t("features.step3.description")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">{t("pricing.title")}</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Free Plan */}
              <div className="bg-card border border-border rounded-lg p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold">{t("pricing.free.title")}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{t("pricing.free.price")}</span>
                    <span className="text-muted-foreground">{t("pricing.free.period")}</span>
                  </div>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-accent flex-shrink-0" />
                    <span>{t("pricing.free.features.apis")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-accent flex-shrink-0" />
                    <span>{t("pricing.free.features.requests")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-accent flex-shrink-0" />
                    <span>{t("pricing.free.features.support")}</span>
                  </li>
                </ul>

                <Link href="/register" className="block">
                  <Button variant="outline" className="w-full bg-transparent">
                    {t("pricing.free.cta")}
                  </Button>
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="bg-primary/5 border-2 border-primary rounded-lg p-8 space-y-6 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Popular
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-bold">{t("pricing.pro.title")}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{t("pricing.pro.price")}</span>
                    <span className="text-muted-foreground">{t("pricing.pro.period")}</span>
                  </div>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="font-semibold">{t("pricing.pro.features.apis")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{t("pricing.pro.features.requests")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{t("pricing.pro.features.support")}</span>
                  </li>
                </ul>

                <Link href="/register" className="block">
                  <Button className="w-full">{t("pricing.pro.cta")}</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto bg-card border border-border rounded-lg p-12 text-center space-y-6">
            <h2 className="text-3xl font-bold">{t("hero.title")}</h2>
            <p className="text-xl text-muted-foreground">{t("hero.subtitle")}</p>
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                {t("hero.cta")}
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>Xingling API</p>
        </div>
      </footer>
    </div>
  )
}
