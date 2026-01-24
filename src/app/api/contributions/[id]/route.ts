import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ContributionStatus } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT: Verify or reject contribution (admin only)
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
    const { status, verifiedBy } = body;

    // Validate status
    if (!status || !["verified", "rejected", "pending"].includes(status)) {
      return NextResponse.json(
        { error: "El estado es inválido" },
        { status: 400 }
      );
    }

    // Check if contribution exists
    const existingContribution = await prisma.contribution.findUnique({
      where: { id },
      include: {
        gift: true,
      },
    });

    if (!existingContribution) {
      return NextResponse.json(
        { error: "Contribución no encontrada" },
        { status: 404 }
      );
    }

    const previousStatus = existingContribution.status;
    const newStatus = status as ContributionStatus;

    // Calculate the amount change for the gift
    let amountDelta = 0;

    // If previously verified and now not, subtract the amount
    if (previousStatus === "verified" && newStatus !== "verified") {
      amountDelta = -existingContribution.amount;
    }
    // If now verified and previously not, add the amount
    else if (newStatus === "verified" && previousStatus !== "verified") {
      amountDelta = existingContribution.amount;
    }

    // Update contribution and gift in a transaction
    const [contribution, gift] = await prisma.$transaction(async (tx) => {
      // Update contribution
      const updatedContribution = await tx.contribution.update({
        where: { id },
        data: {
          status: newStatus,
          verifiedAt: newStatus === "verified" ? new Date() : null,
          verifiedBy: newStatus === "verified" ? (verifiedBy || "Admin") : null,
        },
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

      // Update gift currentAmount if needed
      let updatedGift = existingContribution.gift;
      if (amountDelta !== 0) {
        const newCurrentAmount = Math.max(0, existingContribution.gift.currentAmount + amountDelta);

        // Determine new gift status
        let newGiftStatus = existingContribution.gift.status;
        if (existingContribution.gift.type === "fundable" && existingContribution.gift.targetAmount) {
          if (newCurrentAmount >= existingContribution.gift.targetAmount) {
            newGiftStatus = "completed";
          } else if (newCurrentAmount > 0) {
            newGiftStatus = "partially_funded";
          } else {
            newGiftStatus = "available";
          }
        }

        updatedGift = await tx.gift.update({
          where: { id: existingContribution.giftId },
          data: {
            currentAmount: newCurrentAmount,
            status: newGiftStatus,
          },
        });
      }

      return [updatedContribution, updatedGift];
    });

    return NextResponse.json(
      {
        contribution,
        gift: {
          id: gift.id,
          currentAmount: gift.currentAmount,
          status: gift.status,
        },
        message:
          newStatus === "verified"
            ? "Contribución verificada correctamente"
            : newStatus === "rejected"
            ? "Contribución rechazada"
            : "Contribución marcada como pendiente",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating contribution:", error);
    return NextResponse.json(
      { error: "Error al actualizar contribución" },
      { status: 500 }
    );
  }
}

// GET: Get single contribution (admin only)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();

    if (session !== "admin") {
      return NextResponse.json(
        { error: "Acceso no autorizado" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const contribution = await prisma.contribution.findUnique({
      where: { id },
      include: {
        gift: {
          select: {
            id: true,
            title: true,
            type: true,
            imageUrl: true,
            targetAmount: true,
            currentAmount: true,
            status: true,
          },
        },
      },
    });

    if (!contribution) {
      return NextResponse.json(
        { error: "Contribución no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(contribution, { status: 200 });
  } catch (error) {
    console.error("Error fetching contribution:", error);
    return NextResponse.json(
      { error: "Error al obtener contribución" },
      { status: 500 }
    );
  }
}
