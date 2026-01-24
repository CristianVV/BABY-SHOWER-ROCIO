"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface CategoryWithCount extends Category {
  _count?: {
    gifts: number;
  };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // New category form
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

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
      setError("Error al cargar las categorias");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newCategoryName.trim(),
          slug: generateSlug(newCategoryName.trim()),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al crear categoria");
      }

      const newCategory = await response.json();
      setCategories((prev) => [...prev, { ...newCategory, _count: { gifts: 0 } }]);
      setNewCategoryName("");
      setShowNewForm(false);
      setSuccess("Categoria creada correctamente");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error creating category:", err);
      setError(err instanceof Error ? err.message : "Error al crear categoria");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string, giftsCount: number) => {
    if (giftsCount > 0) {
      alert("No puedes eliminar una categoria que tiene regalos. Primero mueve o elimina los regalos.");
      return;
    }

    if (!confirm("¿Estas segura de que quieres eliminar esta categoria?")) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al eliminar categoria");
      }

      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
      setSuccess("Categoria eliminada correctamente");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error deleting category:", err);
      setError(err instanceof Error ? err.message : "Error al eliminar categoria");
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-3xl text-foreground">Categorias</h1>
          <p className="text-foreground-secondary mt-1">
            Gestiona las categorias de regalos
          </p>
        </div>
        <div className="bg-background-white rounded-2xl border border-foreground/10 p-12 text-center">
          <div className="animate-spin w-8 h-8 mx-auto border-2 border-foreground/20 border-t-foreground rounded-full" />
          <p className="mt-4 text-foreground-muted">Cargando categorias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-foreground">Categorias</h1>
          <p className="text-foreground-secondary mt-1">
            {categories.length} {categories.length === 1 ? "categoria" : "categorias"}
          </p>
        </div>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="btn-primary flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={cn("w-5 h-5 transition-transform", showNewForm && "rotate-45")}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          {showNewForm ? "Cancelar" : "Nueva Categoria"}
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-state-error/10 border border-state-error/20 rounded-xl">
          <p className="text-sm text-state-error">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-state-success/10 border border-state-success/20 rounded-xl">
          <p className="text-sm text-state-success">{success}</p>
        </div>
      )}

      {/* New Category Form */}
      {showNewForm && (
        <form
          onSubmit={handleAddCategory}
          className="bg-background-white rounded-2xl border border-foreground/10 p-6"
        >
          <h2 className="font-medium text-foreground mb-4">Nueva Categoria</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nombre de la categoria (ej: Ropa, Muebles)"
              className="input flex-1"
              autoFocus
            />
            <button
              type="submit"
              disabled={saving || !newCategoryName.trim()}
              className="btn-primary px-6"
            >
              {saving ? "Creando..." : "Crear"}
            </button>
          </div>
        </form>
      )}

      {/* Categories List */}
      <div className="space-y-3">
        {categories.length === 0 ? (
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
                  d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6h.008v.008H6V6Z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No hay categorias todavia
            </h3>
            <p className="text-foreground-muted mb-6">
              Crea tu primera categoria para organizar los regalos
            </p>
            <button
              onClick={() => setShowNewForm(true)}
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
              Crear categoria
            </button>
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="bg-background-white rounded-2xl border border-foreground/10 p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent-yellow/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-foreground"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 6h.008v.008H6V6Z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-foreground">{category.name}</p>
                  <p className="text-sm text-foreground-muted">
                    {category._count?.gifts || 0}{" "}
                    {(category._count?.gifts || 0) === 1 ? "regalo" : "regalos"}
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  handleDeleteCategory(category.id, category._count?.gifts || 0)
                }
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  (category._count?.gifts || 0) > 0
                    ? "text-foreground-muted cursor-not-allowed"
                    : "text-state-error hover:bg-state-error/10"
                )}
                title={
                  (category._count?.gifts || 0) > 0
                    ? "No puedes eliminar una categoria con regalos"
                    : "Eliminar categoria"
                }
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
          ))
        )}
      </div>

      {/* Info */}
      <div className="bg-accent-yellow/10 border border-accent-yellow/20 rounded-xl p-4">
        <div className="flex gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-foreground flex-shrink-0 mt-0.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
            />
          </svg>
          <div className="text-sm">
            <p className="font-medium text-foreground mb-1">Sugerencia</p>
            <p className="text-foreground-secondary">
              Categorias comunes para baby shower: Ropa, Muebles, Higiene, Alimentacion,
              Juguetes, Paseo, Dormitorio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
