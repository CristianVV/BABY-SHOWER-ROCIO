import { Suspense } from "react";
import prisma from "@/lib/db";
import HeroSection from "@/components/guest/HeroSection";
import GalleryClient from "@/components/guest/GalleryClient";

async function getSettings() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "settings" },
  });
  return settings;
}

async function getCategories() {
  return prisma.category.findMany({
    orderBy: { order: "asc" },
  });
}

async function getGifts() {
  return prisma.gift.findMany({
    where: {
      status: { not: "hidden" },
    },
    include: {
      category: true,
    },
    orderBy: [{ category: { order: "asc" } }, { order: "asc" }],
  });
}

export default async function GalleryPage() {
  const [settings, categories, gifts] = await Promise.all([
    getSettings(),
    getCategories(),
    getGifts(),
  ]);

  return (
    <main className="min-h-screen">
      <Suspense fallback={<div className="h-96 animate-pulse bg-background-light" />}>
        <HeroSection
          eventTitle={settings?.eventTitle || "Baby Shower de Rocío"}
          eventDate={settings?.eventDate || "15 de febrero de 2026"}
          eventTime={settings?.eventTime || "13:00h"}
          eventLocation={settings?.eventLocation || ""}
          heroMessage={settings?.heroMessage || ""}
        />
      </Suspense>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-serif text-center mb-8">
          Lista de Regalos
        </h2>
        <Suspense fallback={<div className="grid gap-6 animate-pulse" />}>
          <GalleryClient
            categories={categories}
            gifts={gifts}
          />
        </Suspense>
      </section>
    </main>
  );
}
