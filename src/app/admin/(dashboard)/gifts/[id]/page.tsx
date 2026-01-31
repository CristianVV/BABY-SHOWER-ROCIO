"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Category, Gift } from "@/types";

type GiftType = "fundable" | "external" | "custom";

interface GiftWithCategory extends Gift {
  category: Category;
}

export default function EditGiftPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [type, setType] = useState<GiftType>("fundable");
  const [targetAmount, setTargetAmount] = useState("");

  useEffect(() => {
    Promise.all([fetchGift(), fetchCategories()]).finally(() => {
      setLoadingData(false);
    });
  }, [id]);

  const fetchGift = async () => {
    try {
      const response = await fetch(`/api/gifts/${id}`);
      if (!response.ok) {
        throw new Error("Regalo no encontrado");
      }
      const gift: GiftWithCategory = await response.json();

      setCategoryId(gift.categoryId);
      setTitle(gift.title);
      setDescription(gift.description || "");
      setImageUrl(gift.imageUrl || "");
      setExternalUrl(gift.externalUrl || "");
      setType(gift.type as GiftType);
      setTargetAmount(gift.targetAmount ? (gift.targetAmount / 100).toString() : "");
    } catch (err) {
      console.error("Error fetching gift:", err);
      setError("Error al cargar el regalo");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Error al cargar categorias");
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validation
      if (!categoryId) {
        throw new Error("Selecciona una categoria");
      }
      if (!title.trim()) {
        throw new Error("El titulo es requerido");
      }
      if (type === "fundable" && (!targetAmount || parseFloat(targetAmount) <= 0)) {
        throw new Error("El monto objetivo es requerido para regalos financiables");
      }
      if (type === "external" && !externalUrl.trim()) {
        throw new Error("El enlace externo es requerido para compras externas");
      }

      const response = await fetch(`/api/gifts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryId,
          title: title.trim(),
          description: description.trim() || null,
          imageUrl: imageUrl.trim() || null,
          externalUrl: externalUrl.trim() || null,
          type,
          targetAmount: type === "fundable" ? Math.round(parseFloat(targetAmount) * 100) : null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al actualizar el regalo");
      }

      router.push("/admin/gifts");
      router.refresh();
    } catch (err) {
      console.error("Error updating gift:", err);
      setError(err instanceof Error ? err.message : "Error al actualizar el regalo");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Estas segura de que quieres eliminar este regalo? Esta accion no se puede deshacer.")) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/gifts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al eliminar el regalo");
      }

      router.push("/admin/gifts");
      router.refresh();
    } catch (err) {
      console.error("Error deleting gift:", err);
      setError(err instanceof Error ? err.message : "Error al eliminar el regalo");
    } finally {
      setDeleting(false);
    }
  };

  const typeOptions = [
    {
      value: "fundable",
      label: "Financiable",
      description: "Los invitados pueden contribuir cualquier cantidad hacia el objetivo",
    },
    {
      value: "external",
      label: "Compra Externa",
      description: "El invitado compra directamente en una tienda externa (ej: Amazon)",
    },
    {
      value: "custom",
      label: "Personalizado",
      description: "Contribucion libre sin monto objetivo",
    },
  ];

  if (loadingData) {
    return (
      <div className="max-w-2xl">
        <div className="bg-background-white rounded-2xl border border-foreground/10 p-12 text-center">
          <div className="animate-spin w-8 h-8 mx-auto border-2 border-foreground/20 border-t-foreground rounded-full" />
          <p className="mt-4 text-foreground-muted">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/gifts"
          className="inline-flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground transition-colors mb-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Volver a Regalos
        </Link>
        <h1 className="font-serif text-3xl text-foreground">Editar Regalo</h1>
        <p className="text-foreground-secondary mt-1">
          Modifica los detalles del regalo
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-background-white rounded-2xl border border-foreground/10 p-6 space-y-6">
          {/* Category */}
          <div>
            <label htmlFor="category" className="label block mb-2">
              Categoria *
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="input w-full"
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Gift Type */}
          <div>
            <label className="label block mb-3">Tipo de Regalo *</label>
            <div className="space-y-3">
              {typeOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                    type === option.value
                      ? "border-foreground bg-foreground/5"
                      : "border-foreground/10 hover:border-foreground/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={option.value}
                    checked={type === option.value}
                    onChange={(e) => setType(e.target.value as GiftType)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-foreground">{option.label}</p>
                    <p className="text-sm text-foreground-muted">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="label block mb-2">
              Titulo *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Cochecito de paseo"
              className="input w-full"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="label block mb-2">
              Descripcion
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Una breve descripcion del regalo..."
              rows={3}
              className="input w-full resize-none"
            />
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="imageUrl" className="label block mb-2">
              URL de la Imagen
            </label>
            <input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="input w-full"
            />
            <p className="text-xs text-foreground-muted mt-1">
              Pega el enlace de una imagen del regalo
            </p>
          </div>

          {/* External URL (for external type) */}
          {type === "external" && (
            <div>
              <label htmlFor="externalUrl" className="label block mb-2">
                Enlace de Compra *
              </label>
              <input
                id="externalUrl"
                type="url"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://amazon.es/..."
                className="input w-full"
                required
              />
              <p className="text-xs text-foreground-muted mt-1">
                El enlace donde el invitado puede comprar el regalo
              </p>
            </div>
          )}

          {/* Target Amount (for fundable type) */}
          {type === "fundable" && (
            <div>
              <label htmlFor="targetAmount" className="label block mb-2">
                Monto Objetivo (EUR) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted">
                  EUR
                </span>
                <input
                  id="targetAmount"
                  type="number"
                  min="1"
                  step="0.01"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="0.00"
                  className="input w-full pl-14"
                  required
                />
              </div>
              <p className="text-xs text-foreground-muted mt-1">
                El monto total necesario para completar este regalo
              </p>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-state-error/10 border border-state-error/20 rounded-xl">
            <p className="text-sm text-state-error">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 py-3"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Guardando...
              </span>
            ) : (
              "Guardar Cambios"
            )}
          </button>
          <Link href="/admin/gifts" className="btn-secondary py-3 px-6">
            Cancelar
          </Link>
        </div>

        {/* Delete Section */}
        <div className="border-t border-foreground/10 pt-6">
          <div className="bg-state-error/5 border border-state-error/20 rounded-xl p-6">
            <h3 className="font-medium text-state-error mb-2">Zona de Peligro</h3>
            <p className="text-sm text-foreground-muted mb-4">
              Una vez eliminado, el regalo y todas sus contribuciones seran borrados permanentemente.
            </p>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="btn border-state-error text-state-error hover:bg-state-error/10"
            >
              {deleting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Eliminando...
                </span>
              ) : (
                "Eliminar Regalo"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
