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
  className?: string;
}

export default function GiftGallery({
  initialGifts,
  initialCategories,
  currency,
  onAddToCart,
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

  // Filter gifts by category
  const filteredGifts = selectedCategory
    ? gifts.filter((gift) => gift.categoryId === selectedCategory)
    : gifts;

  // Only show non-hidden gifts
  const visibleGifts = filteredGifts.filter((gift) => gift.status !== "hidden");

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
        {/* Section header */}
        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-2">
            Lista de Regalos
          </h2>
          <p className="text-foreground-secondary">
            Elige como quieres contribuir
          </p>
        </div>

        {/* Category filter tabs */}
        {categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide justify-start md:justify-center">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                selectedCategory === null
                  ? "bg-foreground text-background-white"
                  : "bg-background-light text-foreground-secondary hover:bg-foreground/10"
              )}
            >
              Todos
              <span className="ml-1.5 text-xs opacity-70">
                ({gifts.filter((g) => g.status !== "hidden").length})
              </span>
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  selectedCategory === category.id
                    ? "bg-foreground text-background-white"
                    : "bg-background-light text-foreground-secondary hover:bg-foreground/10"
                )}
              >
                {category.name}
                <span className="ml-1.5 text-xs opacity-70">
                  ({getCategoryCount(category.id)})
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Gifts grid */}
        {visibleGifts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleGifts.map((gift) => (
              <GiftCard
                key={gift.id}
                gift={gift}
                currency={currency}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
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
              No hay regalos disponibles en esta categoria
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
