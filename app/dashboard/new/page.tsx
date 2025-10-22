"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { db, isConfigValid } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp, query, where, getDocs, getDoc, doc } from "firebase/firestore"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Plus, Trash2, Loader2, ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"

interface Field {
  name: string
  type: string
}

const FIELD_TYPES = [
  { value: "string", label: "Texto (String)" },
  { value: "number", label: "Número (Number)" },
  { value: "boolean", label: "Booleano (Boolean)" },
  { value: "email", label: "Email" },
  { value: "name", label: "Nome" },
  { value: "phone", label: "Telefone" },
  { value: "date", label: "Data" },
  { value: "url", label: "URL" },
  { value: "uuid", label: "UUID" },
  { value: "image", label: "Imagem URL" },
]

export default function NewAPIPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [fields, setFields] = useState<Field[]>([{ name: "", type: "string" }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [userPlan, setUserPlan] = useState<"free" | "pro">("free")
  const [apiCount, setApiCount] = useState(0)
  const [checkingLimit, setCheckingLimit] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      checkApiLimit()
    }
  }, [user])

  const checkApiLimit = async () => {
    if (!user || !db) {
      setCheckingLimit(false)
      return
    }

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid))
      const plan = userDoc.exists() ? userDoc.data()?.plan || "free" : "free"
      setUserPlan(plan)

      const q = query(collection(db, "apis"), where("userId", "==", user.uid))
      const querySnapshot = await getDocs(q)
      setApiCount(querySnapshot.size)

      if (plan === "free" && querySnapshot.size >= 2) {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error checking API limit:", error)
    } finally {
      setCheckingLimit(false)
    }
  }

  const addField = () => {
    setFields([...fields, { name: "", type: "string" }])
  }

  const removeField = (index: number) => {
    if (fields.length > 1) {
      setFields(fields.filter((_, i) => i !== index))
    }
  }

  const updateField = (index: number, key: keyof Field, value: string) => {
    const newFields = [...fields]
    newFields[index][key] = value
    setFields(newFields)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!db) {
      setError("Firebase não está configurado. Por favor, configure as variáveis de ambiente.")
      return
    }

    if (userPlan === "free" && apiCount >= 2) {
      setError("Você atingiu o limite de 2 APIs gratuitas. Faça upgrade para Pro.")
      return
    }

    if (!name.trim()) {
      setError("Nome da API é obrigatório")
      return
    }

    if (fields.some((f) => !f.name.trim())) {
      setError("Todos os campos devem ter um nome")
      return
    }

    const fieldNames = fields.map((f) => f.name.toLowerCase())
    if (new Set(fieldNames).size !== fieldNames.length) {
      setError("Nomes de campos duplicados não são permitidos")
      return
    }

    setLoading(true)

    try {
      const endpointId = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")

      const endpoint = `${window.location.origin}/api/${endpointId}`

      await addDoc(collection(db, "apis"), {
        userId: user?.uid,
        name,
        description,
        fields,
        endpoint,
        endpointId,
        createdAt: serverTimestamp(),
      })

      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Erro ao criar API")
      setLoading(false)
    }
  }

  if (authLoading || !user || checkingLimit) {
    return null
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
                As variáveis de ambiente do Firebase não estão configuradas. Por favor, configure o Firebase para criar
                APIs.
              </AlertDescription>
            </Alert>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Nova API</h1>
              <p className="text-muted-foreground mt-1">Defina a estrutura da sua API fake</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>Nome e descrição da sua API</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da API *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Usuários, Produtos, Posts..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o propósito desta API..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Estrutura de Dados</CardTitle>
                    <CardDescription>Defina os campos que sua API irá retornar</CardDescription>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addField} disabled={loading}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Campo
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`field-name-${index}`}>Nome do Campo</Label>
                      <Input
                        id={`field-name-${index}`}
                        placeholder="Ex: nome, email, idade..."
                        value={field.name}
                        onChange={(e) => updateField(index, "name", e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`field-type-${index}`}>Tipo</Label>
                      <Select
                        value={field.type}
                        onValueChange={(value) => updateField(index, "type", value)}
                        disabled={loading}
                      >
                        <SelectTrigger id={`field-type-${index}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FIELD_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeField(index)}
                      disabled={fields.length === 1 || loading}
                      className="mt-8 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex gap-3 justify-end">
              <Link href="/dashboard">
                <Button type="button" variant="outline" disabled={loading}>
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  "Criar API"
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
