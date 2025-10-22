import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"
import { generateFakeData } from "@/lib/fake-data-generator"

export async function GET(request: NextRequest, { params }: { params: Promise<{ endpointId: string }> }) {
  try {
    const { endpointId } = await params

    // Find the API configuration in Firestore
    const q = query(collection(db, "apis"), where("endpointId", "==", endpointId))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return NextResponse.json({ error: "API not found" }, { status: 404 })
    }

    const apiDoc = querySnapshot.docs[0]
    const apiData = apiDoc.data()

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const count = Math.min(Number.parseInt(searchParams.get("count") || "10"), 100) // Max 100 items
    const page = Math.max(Number.parseInt(searchParams.get("page") || "1"), 1)

    // Generate fake data based on the API structure
    const data = Array.from({ length: count }, (_, index) => {
      const item: Record<string, any> = {
        id: (page - 1) * count + index + 1,
      }

      apiData.fields.forEach((field: { name: string; type: string }) => {
        item[field.name] = generateFakeData(field.type)
      })

      return item
    })

    return NextResponse.json({
      data,
      meta: {
        page,
        count,
        total: count * 10, // Simulated total
      },
    })
  } catch (error) {
    console.error("Error generating fake data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ endpointId: string }> }) {
  try {
    const { endpointId } = await params
    const body = await request.json()

    // Find the API configuration
    const q = query(collection(db, "apis"), where("endpointId", "==", endpointId))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return NextResponse.json({ error: "API not found" }, { status: 404 })
    }

    // Simulate creating a resource
    return NextResponse.json(
      {
        id: Math.floor(Math.random() * 10000),
        ...body,
        createdAt: new Date().toISOString(),
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ endpointId: string }> }) {
  try {
    const { endpointId } = await params
    const body = await request.json()

    // Find the API configuration
    const q = query(collection(db, "apis"), where("endpointId", "==", endpointId))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return NextResponse.json({ error: "API not found" }, { status: 404 })
    }

    // Simulate updating a resource
    return NextResponse.json({
      ...body,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ endpointId: string }> }) {
  try {
    const { endpointId } = await params

    // Find the API configuration
    const q = query(collection(db, "apis"), where("endpointId", "==", endpointId))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return NextResponse.json({ error: "API not found" }, { status: 404 })
    }

    // Simulate deleting a resource
    return NextResponse.json({ message: "Resource deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
