"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GiftTable from "@/components/admin/GiftTable";
import type { Gift, Category, GiftStatus } from "@/types";

interface GiftWithCategory extends Gift {
  category: Category;
  _count?: {
    contributions: number;
  };
}

export default function AdminGiftsPage() {
  const router = useRouter();
  const [gifts, setGifts] = useState<GiftWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchGifts();
  }, []);

  const fetchGifts = async () => {
    try {
      const response = await fetch("/api/gifts?includeHidden=true");
      if (!response.ok) {
        throw new Error("Error al cargar regalos");
      }
      const data = await response.json();
      setGifts(data);
    } catch (err) {
      console.error("Error fetching gifts:", err);
      setError("Error al cargar los regalos");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (giftId: string, status: GiftStatus) => {
    try {
      const response = await fetch(`/api/gifts/${giftId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar estado");
      }

      // Update local state
      setGifts((prev) =>
        prev.map((gift) =>
          gift.id === giftId ? { ...gift, status } : gift
        )
      );
    } catch (err) {
      console.error("Error updating gift status:", err);
      alert("Error al actualizar el estado del regalo");
    }
  };

  const handleDelete = async (giftId: string) => {
    try {
      const response = await fetch(`/api/gifts/${giftId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar regalo");
      }

      // Remove from local state
      setGifts((prev) => prev.filter((gift) => gift.id !== giftId));
    } catch (err) {
      console.error("Error deleting gift:", err);
      alert("Error al eliminar el regalo");
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl text-foreground">Regalos</h1>
            <p className="text-foreground-secondary mt-1">
              Gestiona los regalos del registro
            </p>
          </div>
        </div>
        <div className="bg-background-white rounded-2xl border border-foreground/10 p-12 text-center">
          <div className="animate-spin w-8 h-8 mx-auto border-2 border-foreground/20 border-t-foreground rounded-full" />
          <p className="mt-4 text-foreground-muted">Cargando regalos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-foreground">Regalos</h1>
          <p className="text-foreground-secondary mt-1">
            {gifts.length} {gifts.length === 1 ? "regalo" : "regalos"} en el registro
          </p>
        </div>
        <Link href="/admin/gifts/new" className="btn-primary flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Agregar Regalo
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-state-error/10 border border-state-error/20 rounded-xl">
          <p className="text-sm text-state-error">{error}</p>
        </div>
      )}

      {/* Gift Table */}
      <GiftTable
        gifts={gifts}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    </div>
  );
}
