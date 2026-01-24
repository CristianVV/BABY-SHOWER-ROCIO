import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ContributionStatus, PaymentMethodType, Currency } from "@prisma/client";

// GET: List contributions with optional status filter (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (session !== "admin") {
      return NextResponse.json(
        { error: "Acceso no autorizado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const giftId = searchParams.get("giftId");

    // Build where clause
    const where: {
      status?: ContributionStatus;
      giftId?: string;
    } = {};

    if (status && ["pending", "verified", "rejected"].includes(status)) {
      where.status = status as ContributionStatus;
    }

    if (giftId) {
      where.giftId = giftId;
    }

    const contributions = await prisma.contribution.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        gift: {
          select: {
            id: true,
            title: true,
            type: true,
            imageUrl: true,
          },
        },
      },
    });

    return NextResponse.json(contributions, { status: 200 });
  } catch (error) {
    console.error("Error fetching contributions:", error);
    return NextResponse.json(
      { error: "Error al obtener contribuciones" },
      { status: 500 }
    );
  }
}

// POST: Submit new contribution (guest)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    // At least guest session required
    if (session !== "guest" && session !== "admin") {
      return NextResponse.json(
        { error: "Debes iniciar sesión como invitado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      giftId,
      guestName,
      guestPhone,
      guestMessage,
      amount,
      currency,
      paymentMethod,
    } = body;

    // Validation
    if (!giftId || typeof giftId !== "string") {
      return NextResponse.json(
        { error: "El regalo es requerido" },
        { status: 400 }
      );
    }

    if (!guestName || typeof guestName !== "string" || guestName.trim().length < 2) {
      return NextResponse.json(
        { error: "El nombre es requerido (mínimo 2 caracteres)" },
        { status: 400 }
      );
    }

    if (!guestPhone || typeof guestPhone !== "string") {
      return NextResponse.json(
        { error: "El teléfono es requerido" },
        { status: 400 }
      );
    }

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "El monto debe ser mayor a 0" },
        { status: 400 }
      );
    }

    if (!currency || !["EUR", "COP"].includes(currency)) {
      return NextResponse.json(
        { error: "La moneda es inválida" },
        { status: 400 }
      );
    }

    if (!paymentMethod || !["bizum", "revolut", "bancolombia"].includes(paymentMethod)) {
      return NextResponse.json(
        { error: "El método de pago es inválido" },
        { status: 400 }
      );
    }

    // Minimum contribution check (10 EUR or equivalent)
    const minAmountEUR = 1000; // 10 EUR in cents
    const minAmountCOP = 50000; // Approximate COP equivalent in cents

    if (currency === "EUR" && amount < minAmountEUR) {
      return NextResponse.json(
        { error: "La contribución mínima es de 10 EUR" },
        { status: 400 }
      );
    }

    if (currency === "COP" && amount < minAmountCOP) {
      return NextResponse.json(
        { error: "La contribución mínima es de 500 COP" },
        { status: 400 }
      );
    }

    // Check if gift exists and is available
    const gift = await prisma.gift.findUnique({
      where: { id: giftId },
    });

    if (!gift) {
      return NextResponse.json(
        { error: "Regalo no encontrado" },
        { status: 404 }
      );
    }

    if (gift.status === "hidden") {
      return NextResponse.json(
        { error: "Este regalo no está disponible" },
        { status: 400 }
      );
    }

    if (gift.status === "completed") {
      return NextResponse.json(
        { error: "Este regalo ya ha sido completado" },
        { status: 400 }
      );
    }

    // Create contribution with pending status
    const contribution = await prisma.contribution.create({
      data: {
        giftId,
        guestName: guestName.trim(),
        guestPhone: guestPhone.trim(),
        guestMessage: guestMessage?.trim() || null,
        amount,
        currency: currency as Currency,
        paymentMethod: paymentMethod as PaymentMethodType,
        status: "pending",
      },
      include: {
        gift: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
      },
    });

    return NextResponse.json(contribution, { status: 201 });
  } catch (error) {
    console.error("Error creating contribution:", error);
    return NextResponse.json(
      { error: "Error al crear contribución" },
      { status: 500 }
    );
  }
}
