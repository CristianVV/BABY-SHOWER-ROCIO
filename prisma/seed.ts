import { PrismaClient, GiftType, Currency, PaymentMethodType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌼 Seeding database...");

  // Create categories
  const categories = [
    { name: "Ropa", slug: "ropa", order: 1 },
    { name: "Muebles", slug: "muebles", order: 2 },
    { name: "Higiene", slug: "higiene", order: 3 },
    { name: "Alimentación", slug: "alimentacion", order: 4 },
    { name: "Juguetes", slug: "juguetes", order: 5 },
    { name: "Paseo", slug: "paseo", order: 6 },
    { name: "Decoración", slug: "decoracion", order: 7 },
    { name: "Experiencias", slug: "experiencias", order: 8 },
    { name: "Contribución Libre", slug: "contribucion-libre", order: 9 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("✅ Categories created");

  // Create default payment method (Bizum)
  await prisma.paymentMethod.upsert({
    where: { type: PaymentMethodType.bizum },
    update: {},
    create: {
      type: PaymentMethodType.bizum,
      label: "Bizum",
      value: "+34 649 22 55 90",
      currency: Currency.EUR,
      enabled: true,
      order: 1,
    },
  });

  // Create placeholder for Revolut (to be configured in admin)
  await prisma.paymentMethod.upsert({
    where: { type: PaymentMethodType.revolut },
    update: {},
    create: {
      type: PaymentMethodType.revolut,
      label: "Revolut",
      value: "",
      currency: Currency.EUR,
      enabled: false,
      order: 2,
    },
  });

  // Create placeholder for Bancolombia (to be configured in admin)
  await prisma.paymentMethod.upsert({
    where: { type: PaymentMethodType.bancolombia },
    update: {},
    create: {
      type: PaymentMethodType.bancolombia,
      label: "Bancolombia",
      value: "",
      currency: Currency.COP,
      enabled: false,
      order: 3,
    },
  });
  console.log("✅ Payment methods created");

  // Create default site settings
  await prisma.siteSettings.upsert({
    where: { id: "settings" },
    update: {},
    create: {
      id: "settings",
      guestPassword: process.env.INITIAL_GUEST_PASSWORD || "Rocio2026",
      adminPassword: process.env.INITIAL_ADMIN_PASSWORD || "AdminRocio2026",
      eventTitle: "Baby Shower de Rocío",
      eventDate: "15 de febrero de 2026",
      eventTime: "13:00h",
      eventLocation: "Calle de la Azalea, Alcobendas, Madrid",
      heroMessage:
        "Gracias por acompañarnos en esta celebración tan especial. Tu cariño y generosidad significan el mundo para nosotros.",
      whatsappNumber: "+34649225590",
    },
  });
  console.log("✅ Site settings created");

  // Create a sample "Contribución Libre" gift
  const libreCategory = await prisma.category.findUnique({
    where: { slug: "contribucion-libre" },
  });

  if (libreCategory) {
    await prisma.gift.upsert({
      where: { id: "contribucion-libre-default" },
      update: {},
      create: {
        id: "contribucion-libre-default",
        categoryId: libreCategory.id,
        title: "Contribución Libre",
        description:
          "¿Prefieres contribuir con la cantidad que desees? Tu generosidad, sin importar el monto, nos llena de alegría.",
        type: GiftType.custom,
        status: "available",
        order: 1,
      },
    });
    console.log("✅ Default free contribution gift created");
  }

  console.log("🌼 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
