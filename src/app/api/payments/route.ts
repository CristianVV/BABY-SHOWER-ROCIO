import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET all payment methods
export async function GET() {
  try {
    const paymentMethods = await prisma.paymentMethod.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ success: true, data: paymentMethods });
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener metodos de pago" },
      { status: 500 }
    );
  }
}

// POST create or update payment method
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (session !== "admin") {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, label, value, currency, enabled } = body;

    if (!type || !label || !value || !currency) {
      return NextResponse.json(
        { success: false, error: "Campos requeridos faltantes" },
        { status: 400 }
      );
    }

    // Upsert payment method (since type is unique)
    const paymentMethod = await prisma.paymentMethod.upsert({
      where: { type },
      update: {
        label,
        value,
        currency,
        enabled: enabled ?? true,
      },
      create: {
        type,
        label,
        value,
        currency,
        enabled: enabled ?? true,
      },
    });

    return NextResponse.json({ success: true, data: paymentMethod });
  } catch (error) {
    console.error("Error saving payment method:", error);
    return NextResponse.json(
      { success: false, error: "Error al guardar metodo de pago" },
      { status: 500 }
    );
  }
}
