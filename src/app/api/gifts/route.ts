import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { GiftType, GiftStatus } from "@prisma/client";

// GET: List gifts with optional category filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("category");
    const includeHidden = searchParams.get("includeHidden") === "true";

    const session = await getSession();

    // Build where clause
    const where: {
      categoryId?: string;
      status?: { not: GiftStatus };
    } = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Only show hidden gifts to admins
    if (!includeHidden || session !== "admin") {
      where.status = { not: "hidden" };
    }

    const gifts = await prisma.gift.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: { contributions: true },
        },
      },
    });

    return NextResponse.json(gifts, { status: 200 });
  } catch (error) {
    console.error("Error fetching gifts:", error);
    return NextResponse.json(
      { error: "Error al obtener regalos" },
      { status: 500 }
    );
  }
}

// POST: Create gift (admin only)
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
    const {
      categoryId,
      title,
      description,
      imageUrl,
      externalUrl,
      type,
      targetAmount,
      status,
      order,
    } = body;

    // Validation
    if (!categoryId || typeof categoryId !== "string") {
      return NextResponse.json(
        { error: "La categoría es requerida" },
        { status: 400 }
      );
    }

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "El título es requerido" },
        { status: 400 }
      );
    }

    if (!type || !["fundable", "external", "custom"].includes(type)) {
      return NextResponse.json(
        { error: "El tipo de regalo es inválido" },
        { status: 400 }
      );
    }

    // Check category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    // For fundable gifts, targetAmount is required
    if (type === "fundable" && (!targetAmount || targetAmount <= 0)) {
      return NextResponse.json(
        { error: "El monto objetivo es requerido para regalos financiables" },
        { status: 400 }
      );
    }

    // For external gifts, externalUrl is required
    if (type === "external" && !externalUrl) {
      return NextResponse.json(
        { error: "El enlace externo es requerido para compras externas" },
        { status: 400 }
      );
    }

    // Get max order if not provided
    let giftOrder = order;
    if (typeof giftOrder !== "number") {
      const maxOrderGift = await prisma.gift.findFirst({
        where: { categoryId },
        orderBy: { order: "desc" },
        select: { order: true },
      });
      giftOrder = (maxOrderGift?.order ?? -1) + 1;
    }

    const gift = await prisma.gift.create({
      data: {
        categoryId,
        title,
        description: description || null,
        imageUrl: imageUrl || null,
        externalUrl: externalUrl || null,
        type: type as GiftType,
        targetAmount: targetAmount || null,
        currentAmount: 0,
        status: (status as GiftStatus) || "available",
        order: giftOrder,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(gift, { status: 201 });
  } catch (error) {
    console.error("Error creating gift:", error);
    return NextResponse.json(
      { error: "Error al crear regalo" },
      { status: 500 }
    );
  }
}
