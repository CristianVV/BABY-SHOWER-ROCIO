"use client";

import { useState, useEffect } from "react";
import GiftCard from "./GiftCard";
import { cn } from "@/lib/utils";
import type { Gift, Category } from "@/types";

interface GiftWithCategory extends Gift {
  category: Category;
}

interface GiftGalleryProps {
  initialGifts?: GiftWithCategory[];
  initialCategories?: Category[];
  currency: "EUR" | "COP";
  onAddToCart: (giftId: string, amount: number, message?: string) => void;
  onCurrencyChange: (currency: "EUR" | "COP") => void;
  className?: string;
}

export default function GiftGallery({
  initialGifts,
  initialCategories,
  currency,
  onAddToCart,
  onCurrencyChange,
  className,
}: GiftGalleryProps) {
  const [gifts, setGifts] = useState<GiftWithCategory[]>(initialGifts || []);
  const [categories, setCategories] = useState<Category[]>(
    initialCategories || []
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!initialGifts);
  const [error, setError] = useState<string | null>(null);

  // Fetch gifts from API if not provided initially
  useEffect(() => {
    if (initialGifts && initialCategories) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [giftsRes, categoriesRes] = await Promise.all([
          fetch("/api/gifts"),
          fetch("/api/categories"),
        ]);

        if (!giftsRes.ok || !categoriesRes.ok) {
          throw new Error("Error al cargar los regalos");
        }

        const giftsData = await giftsRes.json();
        const categoriesData = await categoriesRes.json();

        setGifts(giftsData.data || []);
        setCategories(categoriesData.data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar los regalos"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [initialGifts, initialCategories]);

  // Filter categories to only those with visible gifts
  const validCategories = categories.filter((category) =>
    gifts.some((gift) => gift.categoryId === category.id && gift.status !== "hidden")
  );

  // Group gifts by category for the "All" view
  const categoriesToShow = selectedCategory
    ? validCategories.filter((c) => c.id === selectedCategory)
    : validCategories;

  // Count gifts per category for badge display
  const getCategoryCount = (categoryId: string) => {
    return gifts.filter(
      (g) => g.categoryId === categoryId && g.status !== "hidden"
    ).length;
  };

  if (isLoading) {
    return (
      <section className={cn("py-12 px-4", className)}>
        <div className="max-w-6xl mx-auto">
          {/* Skeleton filter tabs */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-10 w-24 bg-foreground/10 rounded-full animate-pulse flex-shrink-0"
              />
            ))}
          </div>

          {/* Skeleton grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="card overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-foreground/10" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-foreground/10 rounded w-3/4" />
                  <div className="h-4 bg-foreground/10 rounded w-full" />
                  <div className="h-4 bg-foreground/10 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={cn("py-12 px-4", className)}>
        <div className="max-w-md mx-auto text-center">
          <div className="card p-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto mb-4 text-state-error"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-foreground-secondary mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-accent-green hover:underline"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("py-12 px-4", className)}>
      <div className="max-w-6xl mx-auto">
        {/* Amazon Registry Link */}
        <div className="mb-12">
          <div className="card p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-surface-container border-2 border-primary/20">
            <div className="text-center md:text-left space-y-2">
              <h3 className="font-serif text-xl md:text-2xl text-primary font-medium">
                Lista de Nacimiento en Amazon
              </h3>
              <p className="text-foreground-secondary text-sm md:text-base max-w-lg">
                Hemos creado también una lista en Amazon con cositas que nos harían mucha ilusión.
              </p>
            </div>
            <a
              href="https://www.amazon.es/baby-reg/crisypalma-vidaurrazaga-febrero-2026-alcobendas/113BYRXA2QSRL"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary whitespace-nowrap px-8 py-3 text-base shadow-md hover:shadow-lg transform transition-all active:scale-95"
            >
              Ver Lista de Amazon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        {/* Category filter tabs */}
        {validCategories.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "w-full py-4 rounded-2xl text-base md:text-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md",
                selectedCategory === null
                  ? "bg-foreground text-background-white ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : "bg-surface-white text-foreground-secondary hover:bg-surface-variant border border-primary/10"
              )}
            >
              Todos
              <span className="block text-xs opacity-70 mt-1 font-normal">
                {gifts.filter((g) => g.status !== "hidden").length} artículos
              </span>
            </button>

            {validCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                className={cn(
                  "w-full py-4 rounded-2xl text-base md:text-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md",
                  selectedCategory === category.id
                    ? "bg-foreground text-background-white ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : "bg-surface-white text-foreground-secondary hover:bg-surface-variant border border-primary/10"
                )}
              >
                {category.name}
                <span className="block text-xs opacity-70 mt-1 font-normal">
                  {getCategoryCount(category.id)} artículos
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Grouped Gifts Grid */}
        <div className="space-y-16">
          {categoriesToShow.map((category) => {
            const categoryGifts = gifts.filter(
              (g) => g.categoryId === category.id && g.status !== "hidden"
            );

            if (categoryGifts.length === 0) return null;

            return (
              <div key={category.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h3 className="font-serif text-3xl md:text-4xl text-primary text-center mb-8">
                  {category.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryGifts.map((gift) => (
                    <GiftCard
                      key={gift.id}
                      gift={gift}
                      currency={currency}
                      onCurrencyChange={onCurrencyChange}
                      onAddToCart={onAddToCart}
                      className="h-full"
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {categoriesToShow.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 opacity-50">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="12" fill="#E8B931" />
                  {[...Array(8)].map((_, i) => (
                    <ellipse
                      key={i}
                      cx="50"
                      cy="25"
                      rx="8"
                      ry="20"
                      fill="white"
                      transform={`rotate(${i * 45} 50 50)`}
                    />
                  ))}
                </svg>
              </div>
              <p className="text-foreground-secondary">
                No hay regalos disponibles en esta categoría
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
