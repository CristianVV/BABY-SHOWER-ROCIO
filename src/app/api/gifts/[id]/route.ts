import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { GiftType, GiftStatus } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET: Single gift with contributions count
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const gift = await prisma.gift.findUnique({
      where: { id },
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
        contributions: {
          where: { status: "verified" },
          select: {
            id: true,
            amount: true,
            currency: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!gift) {
      return NextResponse.json(
        { error: "Regalo no encontrado" },
        { status: 404 }
      );
    }

    // Hide hidden gifts from non-admins
    const session = await getSession();
    if (gift.status === "hidden" && session !== "admin") {
      return NextResponse.json(
        { error: "Regalo no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(gift, { status: 200 });
  } catch (error) {
    console.error("Error fetching gift:", error);
    return NextResponse.json(
      { error: "Error al obtener regalo" },
      { status: 500 }
    );
  }
}

// PUT: Update gift (admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();

    if (session !== "admin") {
      return NextResponse.json(
        { error: "Acceso no autorizado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const {
      categoryId,
      title,
      description,
      imageUrl,
      externalUrl,
      type,
      targetAmount,
      currentAmount,
      status,
      order,
    } = body;

    // Check if gift exists
    const existingGift = await prisma.gift.findUnique({
      where: { id },
    });

    if (!existingGift) {
      return NextResponse.json(
        { error: "Regalo no encontrado" },
        { status: 404 }
      );
    }

    // If changing category, verify it exists
    if (categoryId && categoryId !== existingGift.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        return NextResponse.json(
          { error: "Categoría no encontrada" },
          { status: 404 }
        );
      }
    }

    // Build update data
    const updateData: {
      categoryId?: string;
      title?: string;
      description?: string | null;
      imageUrl?: string | null;
      externalUrl?: string | null;
      type?: GiftType;
      targetAmount?: number | null;
      currentAmount?: number;
      status?: GiftStatus;
      order?: number;
    } = {};

    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description || null;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl || null;
    if (externalUrl !== undefined) updateData.externalUrl = externalUrl || null;
    if (type !== undefined) updateData.type = type as GiftType;
    if (targetAmount !== undefined) updateData.targetAmount = targetAmount || null;
    if (currentAmount !== undefined) updateData.currentAmount = currentAmount;
    if (status !== undefined) updateData.status = status as GiftStatus;
    if (order !== undefined) updateData.order = order;

    const gift = await prisma.gift.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(gift, { status: 200 });
  } catch (error) {
    console.error("Error updating gift:", error);
    return NextResponse.json(
      { error: "Error al actualizar regalo" },
      { status: 500 }
    );
  }
}

// DELETE: Delete gift (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();

    if (session !== "admin") {
      return NextResponse.json(
        { error: "Acceso no autorizado" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if gift exists
    const existingGift = await prisma.gift.findUnique({
      where: { id },
      include: {
        _count: {
          select: { contributions: true },
        },
      },
    });

    if (!existingGift) {
      return NextResponse.json(
        { error: "Regalo no encontrado" },
        { status: 404 }
      );
    }

    // Delete gift (contributions will cascade delete per schema)
    await prisma.gift.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: "Regalo eliminado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting gift:", error);
    return NextResponse.json(
      { error: "Error al eliminar regalo" },
      { status: 500 }
    );
  }
}
