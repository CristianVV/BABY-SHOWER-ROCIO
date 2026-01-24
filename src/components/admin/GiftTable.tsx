"use client";

import Link from "next/link";
import { useState } from "react";
import { cn, formatCurrency, calculateProgress } from "@/lib/utils";
import type { Gift, Category, GiftStatus } from "@/types";

interface GiftWithCategory extends Gift {
  category: Category;
  _count?: {
    contributions: number;
  };
}

interface GiftTableProps {
  gifts: GiftWithCategory[];
  onStatusChange?: (giftId: string, status: GiftStatus) => void;
  onDelete?: (giftId: string) => void;
}

const statusLabels: Record<GiftStatus, string> = {
  available: "Disponible",
  partially_funded: "Parcialmente financiado",
  completed: "Completado",
  hidden: "Oculto",
};

const statusStyles: Record<GiftStatus, string> = {
  available: "bg-state-success/10 text-state-success",
  partially_funded: "bg-state-pending/10 text-foreground",
  completed: "bg-foreground/10 text-foreground",
  hidden: "bg-state-error/10 text-state-error",
};

const typeLabels: Record<string, string> = {
  fundable: "Financiable",
  external: "Externo",
  custom: "Personalizado",
};

export default function GiftTable({ gifts, onStatusChange, onDelete }: GiftTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusToggle = async (gift: GiftWithCategory) => {
    if (!onStatusChange) return;
    setLoadingId(gift.id);

    // Cycle through statuses: available -> hidden -> available
    const newStatus: GiftStatus = gift.status === "hidden" ? "available" : "hidden";

    try {
      await onStatusChange(gift.id, newStatus);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (giftId: string) => {
    if (!onDelete) return;
    if (!confirm("¿Estas segura de que quieres eliminar este regalo? Esta accion no se puede deshacer.")) {
      return;
    }
    setLoadingId(giftId);
    try {
      await onDelete(giftId);
    } finally {
      setLoadingId(null);
    }
  };

  if (gifts.length === 0) {
    return (
      <div className="bg-background-white rounded-2xl border border-foreground/10 p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-foreground/5 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 text-foreground-muted"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          No hay regalos todavia
        </h3>
        <p className="text-foreground-muted mb-6">
          Empieza agregando el primer regalo para tu baby shower
        </p>
        <Link
          href="/admin/gifts/new"
          className="btn-primary inline-flex items-center gap-2"
        >
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
          Agregar regalo
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background-white rounded-2xl border border-foreground/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-foreground/10 bg-background-light/50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                Regalo
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                Progreso
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/5">
            {gifts.map((gift) => {
              const progress = gift.targetAmount
                ? calculateProgress(gift.currentAmount, gift.targetAmount)
                : null;

              return (
                <tr
                  key={gift.id}
                  className={cn(
                    "hover:bg-background-light/30 transition-colors",
                    loadingId === gift.id && "opacity-50"
                  )}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {gift.imageUrl ? (
                        <img
                          src={gift.imageUrl}
                          alt={gift.title}
                          className="w-12 h-12 rounded-xl object-cover bg-background-light"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-background-light flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 text-foreground-muted"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                            />
                          </svg>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-foreground">{gift.title}</p>
                        {gift.description && (
                          <p className="text-sm text-foreground-muted line-clamp-1">
                            {gift.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-foreground-secondary">
                      {gift.category.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-foreground-secondary">
                      {typeLabels[gift.type]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {gift.type === "fundable" && gift.targetAmount ? (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-foreground-secondary">
                            {formatCurrency(gift.currentAmount)}
                          </span>
                          <span className="text-foreground-muted">
                            {formatCurrency(gift.targetAmount)}
                          </span>
                        </div>
                        <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent-green rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-foreground-muted text-right">
                          {progress}%
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-foreground-muted">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleStatusToggle(gift)}
                      disabled={loadingId === gift.id}
                      className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors",
                        statusStyles[gift.status as GiftStatus],
                        "hover:opacity-80 cursor-pointer"
                      )}
                    >
                      {statusLabels[gift.status as GiftStatus]}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/gifts/${gift.id}`}
                        className="p-2 rounded-lg text-foreground-secondary hover:bg-foreground/5 hover:text-foreground transition-colors"
                        title="Editar"
                      >
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
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDelete(gift.id)}
                        disabled={loadingId === gift.id}
                        className="p-2 rounded-lg text-state-error hover:bg-state-error/10 transition-colors"
                        title="Eliminar"
                      >
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
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
