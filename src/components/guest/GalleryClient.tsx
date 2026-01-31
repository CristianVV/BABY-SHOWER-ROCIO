"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import GiftGallery from "./GiftGallery";
import CartDrawer from "./CartDrawer";
import CurrencySelector from "./CurrencySelector";
import type { Category, Gift } from "@/types";

interface GiftWithCategory extends Gift {
  category: Category;
}

interface GalleryClientProps {
  categories: Category[];
  gifts: GiftWithCategory[];
}

export default function GalleryClient({ categories, gifts }: GalleryClientProps) {
  const router = useRouter();
  const { items, addItem, removeItem, itemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currency, setCurrency] = useState<"EUR" | "COP">("EUR");

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push("/checkout");
  };

  const handleAddToCart = (giftId: string, amount: number, message?: string) => {
    const gift = gifts.find((g) => g.id === giftId);
    if (!gift) return;

    addItem({
      giftId,
      giftTitle: gift.title,
      giftType: gift.type,
      amount,
      currency,
      message,
    });

    // Open cart after adding
    setIsCartOpen(true);
  };

  return (
    <>
      {/* Floating cart button */}
      {itemCount > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-30 btn-primary rounded-full w-14 h-14 shadow-lg flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
          <span className="absolute -top-1 -right-1 bg-accent-yellow text-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {itemCount}
          </span>
        </button>
      )}

      {/* Gift gallery */}
      <GiftGallery
        initialCategories={categories}
        initialGifts={gifts}
        currency={currency}
        onCurrencyChange={setCurrency}
        onAddToCart={handleAddToCart}
      />

      {/* Cart drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={items}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
        currency={currency}
      />
    </>
  );
}
