import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Database, Code, Zap, Globe, AlertTriangle, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { isConfigValid } from "@/lib/firebase";

export default function Home() {
  const firebaseConfigured = isConfigValid();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {!firebaseConfigured && (
          <div className="bg-destructive/10 border-b border-destructive/20">
            <div className="container mx-auto px-4 py-4">
              <Alert variant="destructive" className="bg-transparent border-0">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Firebase não configurado</AlertTitle>
                <AlertDescription>
                  Configure as variáveis de ambiente do Firebase para habilitar
                  autenticação e funcionalidades completas.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-balance">
              Crie APIs Fake em <span className="text-primary">segundos</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto text-pretty">
              Gere dados fake automaticamente para seus projetos. Defina a
              estrutura, nós geramos os dados.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8">
                  Começar Grátis
                </Button>
              </Link>
              <Link href="#pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 bg-transparent"
                >
                  Ver Preços
                </Button>
              </Link>
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
              <h3 className="text-xl font-semibold">Rápido</h3>
              <p className="text-muted-foreground leading-relaxed">
                Crie APIs em segundos. Sem configuração complexa.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Database className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Flexível</h3>
              <p className="text-muted-foreground leading-relaxed">
                Defina qualquer estrutura de dados que precisar.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">REST API</h3>
              <p className="text-muted-foreground leading-relaxed">
                Endpoints REST completos com GET, POST, PUT, DELETE.
              </p>
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

        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-center">Como Funciona</h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Defina a Estrutura
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Crie campos como nome, email, idade, etc. Escolha o tipo de
                    cada campo.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Geramos os Dados
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Nossa engine gera automaticamente dados realistas baseados
                    na sua estrutura.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Use a API</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Receba uma URL pública e comece a fazer requisições
                    imediatamente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Preços Simples</h2>
              <p className="text-xl text-muted-foreground">
                Comece grátis, faça upgrade quando precisar
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="bg-card border border-border rounded-lg p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold">Grátis</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-accent flex-shrink-0" />
                    <span>Até 2 APIs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-accent flex-shrink-0" />
                    <span>Dados fake ilimitados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-accent flex-shrink-0" />
                    <span>REST API completa</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-accent flex-shrink-0" />
                    <span>APIs públicas</span>
                  </li>
                </ul>

                <Link href="/register" className="block">
                  <Button variant="outline" className="w-full bg-transparent">
                    Começar Grátis
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
                  <h3 className="text-2xl font-bold">Pro</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$2</span>
                    <span className="text-muted-foreground">/trimestre</span>
                  </div>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="font-semibold">APIs ilimitadas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Dados fake ilimitados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>REST API completa</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>APIs públicas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Suporte prioritário</span>
                  </li>
                </ul>

                <Link href="/register" className="block">
                  <Button className="w-full">Começar Pro</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto bg-card border border-border rounded-lg p-12 text-center space-y-6">
            <h2 className="text-3xl font-bold">Pronto para começar?</h2>
            <p className="text-xl text-muted-foreground">
              Crie suas primeiras 2 APIs grátis em menos de 1 minuto.
            </p>
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                Criar Conta Grátis
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>Xingling API - Dados fake para desenvolvimento</p>
        </div>
      </footer>
    </div>
  );
}
