"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { db, isConfigValid } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Crown,
  AlertCircle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface API {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  fields: Array<{ name: string; type: string }>;
  createdAt: Date;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [apis, setApis] = useState<API[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<"free" | "pro">("free");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadApis();
      loadUserPlan();
    }
  }, [user]);

  const loadUserPlan = async () => {
    if (!user || !db) {
      setLoading(false);
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setUserPlan(userDoc.data()?.plan || "free");
      }
    } catch (error) {
      console.error("Error loading user plan:", error);
    }
  };

  const loadApis = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/apis?userId=${user.uid}`);
      if (!res.ok) throw new Error("Erro ao buscar APIs");
      const apisData = await res.json();
      setApis(apisData);
    } catch (error) {
      console.error("Error loading APIs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (apiId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/apis?userId=${user.uid}&apiId=${apiId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao deletar API");
      setApis(apis.filter((api) => api.id !== apiId));
    } catch (error) {
      console.error("Error deleting API:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const canCreateMoreApis = userPlan === "pro" || apis.length < 2;
  const apiLimitReached = userPlan === "free" && apis.length >= 2;

  if (authLoading || !user) {
    return null;
  }

  if (!isConfigValid()) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Firebase não configurado</AlertTitle>
              <AlertDescription>
                As variáveis de ambiente do Firebase não estão configuradas. Por
                favor, configure o Firebase para usar o dashboard.
              </AlertDescription>
            </Alert>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">Minhas APIs</h1>
                {userPlan === "pro" && (
                  <Badge className="bg-primary text-primary-foreground">
                    <Crown className="h-3 w-3 mr-1" />
                    Pro
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mt-1">
                {userPlan === "free"
                  ? `${apis.length}/2 APIs criadas`
                  : `${apis.length} APIs criadas`}
              </p>
            </div>
            {canCreateMoreApis ? (
              <Link href="/dashboard/new">
                <Button size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova API
                </Button>
              </Link>
            ) : (
              <Button size="lg" disabled>
                <Plus className="h-4 w-4 mr-2" />
                Nova API
              </Button>
            )}
          </div>

          {apiLimitReached && (
            <Alert className="bg-primary/5 border-primary">
              <Crown className="h-4 w-4 text-primary" />
              <AlertTitle>Limite de APIs atingido</AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                <span>
                  Você atingiu o limite de 2 APIs gratuitas. Faça upgrade para
                  criar APIs ilimitadas.
                </span>
                <Button size="sm" className="ml-4">
                  Upgrade para Pro - $2/mês
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : apis.length === 0 ? (
            <Card className="p-12">
              <div className="text-center space-y-4">
                <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Nenhuma API criada</h3>
                  <p className="text-muted-foreground mt-2">
                    Comece criando sua primeira API fake
                  </p>
                </div>
                {canCreateMoreApis ? (
                  <Link href="/dashboard/new">
                    <Button size="lg">
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeira API
                    </Button>
                  </Link>
                ) : (
                  <Button size="lg" disabled>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeira API
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {apis.map((api) => (
                <Card key={api.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{api.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {api.description}
                        </CardDescription>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Deletar API?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. A API será
                              permanentemente deletada.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(api.id)}
                            >
                              Deletar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Campos:</p>
                      <div className="flex flex-wrap gap-1">
                        {api.fields.map((field, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs"
                          >
                            {field.name}: {field.type}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Endpoint:</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-xs bg-muted px-2 py-1 rounded overflow-hidden text-ellipsis whitespace-nowrap">
                          {api.endpoint}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 flex-shrink-0"
                          onClick={() => copyToClipboard(api.endpoint, api.id)}
                        >
                          {copiedId === api.id ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Link href={api.endpoint} target="_blank">
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        size="sm"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Testar API
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
