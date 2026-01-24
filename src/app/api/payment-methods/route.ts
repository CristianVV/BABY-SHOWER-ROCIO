import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { PaymentMethodType, Currency } from "@prisma/client";

// GET: List enabled payment methods (or all for admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(request.url);
    const includeDisabled = searchParams.get("includeDisabled") === "true";

    // Build where clause
    const where: { enabled?: boolean } = {};

    // Only show enabled payment methods to non-admins
    if (!includeDisabled || session !== "admin") {
      where.enabled = true;
    }

    const paymentMethods = await prisma.paymentMethod.findMany({
      where,
      orderBy: { order: "asc" },
    });

    return NextResponse.json(paymentMethods, { status: 200 });
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return NextResponse.json(
      { error: "Error al obtener metodos de pago" },
      { status: 500 }
    );
  }
}

// PUT: Update payment methods (admin only)
// Accepts array of payment methods to upsert
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();

    if (session !== "admin") {
      return NextResponse.json(
        { error: "Acceso no autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { paymentMethods } = body;

    if (!Array.isArray(paymentMethods)) {
      return NextResponse.json(
        { error: "Se esperaba un array de metodos de pago" },
        { status: 400 }
      );
    }

    // Validate each payment method
    for (const pm of paymentMethods) {
      if (!pm.type || !["bizum", "revolut", "bancolombia"].includes(pm.type)) {
        return NextResponse.json(
          { error: `Tipo de pago invalido: ${pm.type}` },
          { status: 400 }
        );
      }

      if (!pm.label || typeof pm.label !== "string") {
        return NextResponse.json(
          { error: "El label es requerido para cada metodo de pago" },
          { status: 400 }
        );
      }

      if (!pm.currency || !["EUR", "COP"].includes(pm.currency)) {
        return NextResponse.json(
          { error: `Moneda invalida: ${pm.currency}` },
          { status: 400 }
        );
      }
    }

    // Upsert payment methods in a transaction
    const results = await prisma.$transaction(
      paymentMethods.map((pm, index) =>
        prisma.paymentMethod.upsert({
          where: { type: pm.type as PaymentMethodType },
          create: {
            type: pm.type as PaymentMethodType,
            label: pm.label,
            value: pm.value || "",
            currency: pm.currency as Currency,
            enabled: pm.enabled ?? true,
            order: pm.order ?? index,
          },
          update: {
            label: pm.label,
            value: pm.value,
            currency: pm.currency as Currency,
            enabled: pm.enabled,
            order: pm.order ?? index,
          },
        })
      )
    );

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("Error updating payment methods:", error);
    return NextResponse.json(
      { error: "Error al actualizar metodos de pago" },
      { status: 500 }
    );
  }
}

// POST: Create or update a single payment method (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (session !== "admin") {
      return NextResponse.json(
        { error: "Acceso no autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, label, value, currency, enabled, order } = body;

    // Validation
    if (!type || !["bizum", "revolut", "bancolombia"].includes(type)) {
      return NextResponse.json(
        { error: "El tipo de pago es invalido" },
        { status: 400 }
      );
    }

    if (!label || typeof label !== "string") {
      return NextResponse.json(
        { error: "El label es requerido" },
        { status: 400 }
      );
    }

    if (!currency || !["EUR", "COP"].includes(currency)) {
      return NextResponse.json(
        { error: "La moneda es invalida" },
        { status: 400 }
      );
    }

    // Get max order if not provided
    let methodOrder = order;
    if (typeof methodOrder !== "number") {
      const maxOrderMethod = await prisma.paymentMethod.findFirst({
        orderBy: { order: "desc" },
        select: { order: true },
      });
      methodOrder = (maxOrderMethod?.order ?? -1) + 1;
    }

    // Upsert payment method (type is unique)
    const paymentMethod = await prisma.paymentMethod.upsert({
      where: { type: type as PaymentMethodType },
      create: {
        type: type as PaymentMethodType,
        label,
        value: value || "",
        currency: currency as Currency,
        enabled: enabled ?? true,
        order: methodOrder,
      },
      update: {
        label,
        value: value || "",
        currency: currency as Currency,
        enabled: enabled ?? true,
        order: methodOrder,
      },
    });

    return NextResponse.json(paymentMethod, { status: 200 });
  } catch (error) {
    console.error("Error creating/updating payment method:", error);
    return NextResponse.json(
      { error: "Error al guardar metodo de pago" },
      { status: 500 }
    );
  }
}
