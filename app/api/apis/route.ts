import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, deleteDoc, doc, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 });
  }
  try {
    const q = query(collection(db, "apis"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const apisData = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    }));
    return NextResponse.json(apisData);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar APIs" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const apiId = searchParams.get("apiId");
  if (!userId || !apiId) {
    return NextResponse.json({ error: "userId e apiId são obrigatórios" }, { status: 400 });
  }
  try {
    await deleteDoc(doc(db, "apis", apiId));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar API" }, { status: 500 });
  }
}
