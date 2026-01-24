import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();

    if (session !== "admin") {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    // Get counts by status
    const [pending, verified, rejected, totalGifts] = await Promise.all([
      prisma.contribution.count({ where: { status: "pending" } }),
      prisma.contribution.count({ where: { status: "verified" } }),
      prisma.contribution.count({ where: { status: "rejected" } }),
      prisma.gift.count(),
    ]);

    // Calculate total raised (verified contributions only)
    const totalRaisedResult = await prisma.contribution.aggregate({
      where: { status: "verified" },
      _sum: { amount: true },
    });

    const totalRaised = totalRaisedResult._sum.amount || 0;

    return NextResponse.json({
      success: true,
      data: {
        pending,
        verified,
        rejected,
        totalGifts,
        totalRaised, // In cents
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener estadisticas" },
      { status: 500 }
    );
  }
}
