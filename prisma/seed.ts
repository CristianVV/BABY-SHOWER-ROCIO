import { PrismaClient, GiftType, Currency, PaymentMethodType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌼 Seeding database...");

  // 1. Create categories
  // We'll upsert them to ensure they exist.
  const categoriesData = [
    { name: "Alimentación", slug: "alimentacion", order: 1 },
    { name: "Salud e Higiene", slug: "salud-e-higiene", order: 2 },
    { name: "Cambio de pañales", slug: "cambio-de-panales", order: 3 },
    { name: "Otros", slug: "otros", order: 4 },
    { name: "Dormitorio", slug: "dormitorio", order: 5 },
    { name: "Baño", slug: "bano", order: 6 },
    { name: "Lactancia", slug: "lactancia", order: 7 },
    { name: "Contribución Libre", slug: "contribucion-libre", order: 90 },
  ];

  // Removed "Dentición" category

  const categoryMap = new Map<string, string>(); // slug -> id

  for (const cat of categoriesData) {
    const result = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, order: cat.order },
      create: cat,
    });
    categoryMap.set(cat.slug, result.id);
  }
  console.log("✅ Categories created/updated");

  // Prune categories not in the list (e.g. Dentición)
  const currentSlugs = categoriesData.map(c => c.slug);
  await prisma.category.deleteMany({
    where: {
      slug: { notIn: currentSlugs }
    }
  });

  // 2. Payment methods
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

  // 3. Site settings
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

  // 4. Gifts
  console.log("🧹 Clearing existing gifts...");
  await prisma.gift.deleteMany({});

  const giftsData = [
    // Baño
    {
      title: "Bañera con soporte",
      categorySlug: "bano",
      description: "Bañera Flexi Bath de Stokke (Verde Transparente) + Soporte para recién nacido + Soporte para Bañera Flexi Bath - Plegable, Duradera y Fácil de guardar.",
      imageUrl: "/Products/Bañera.jpg",
      externalUrl: "https://www.amazon.es/Ba%C3%B1era-Stokke-Soporte-reci%C3%A9n-nacido/dp/B0CTJ2JWJJ?colid=113BYRXA2QSRL&coliid=I2ST7FBPPWWRF3",
      type: GiftType.external,
    },
    // Dormitorio
    {
      title: "Cuna de colecho",
      categorySlug: "dormitorio",
      description: "Chicco Next2Me Essential Cuna Colecho Bebé, Cuna para recién nacidos, Compatible con Varias Camas, Altura Ajustable. [Amazon hace un 15% de descuento en este producto si se compra directamente en la lista de Rocío]",
      imageUrl: "/Products/Colecho.jpg",
      externalUrl: "https://www.amazon.es/baby-reg/crisypalma-vidaurrazaga-febrero-2026-alcobendas/113BYRXA2QSRL",
      type: GiftType.external,
    },
    {
      title: "Sábana Sleepi Mini - Stokke",
      categorySlug: "dormitorio",
      description: "Sábana Protectora para la Sleepi Mini de Stokke, Blanca - Protege el colchón Ovalado de la Sleepi Mini de Stokke contra Accidentes y derrames.",
      imageUrl: "/Products/Sabana.jpg",
      externalUrl: "https://www.amazon.es/Stokke-Sleepi-Protection-Sheet-White/dp/B0BWNK5MRH?colid=113BYRXA2QSRL&coliid=I2I87E8XNLAMO",
      type: GiftType.external,
    },
    // Cambio de pañales
    {
      title: "Cambiadores desechables",
      categorySlug: "cambio-de-panales",
      description: "Cambiadores desechables LILLYDOO, delicados con la piel, 60x60 cm, 50 unidades (5x10 unidades).",
      imageUrl: "/Products/Chnagin_mats.jpg",
      externalUrl: "https://www.amazon.es/dp/B0FK5PP877/ref=br_dsk_yr_itemdt_dp?colid=113BYRXA2QSRL&coliid=I1YZKGRRM5VZEL",
      type: GiftType.external,
    },
    {
      title: "Toallitas húmedas naturales Lillydoo",
      categorySlug: "cambio-de-panales",
      description: "Toallitas húmedas naturales Lillydoo. 100% sin plástico y resistentes - sin perfumes. [Amazon hace un 15% de descuento si se compra en la lista]",
      imageUrl: "/Products/Toallitas_húmedas.webp",
      externalUrl: "https://www.amazon.es/baby-reg/crisypalma-vidaurrazaga-febrero-2026-alcobendas/113BYRXA2QSRL",
      type: GiftType.external,
    },
    {
      title: "Pañales LILLYDOO N°1",
      categorySlug: "cambio-de-panales",
      description: "Talla 1, 2 o 3; protección contra fugas, suaves, sin perfumes ni lociones. [Amazon hace un 15% de descuento si se compra en la lista]",
      imageUrl: "/Products/Pañales.jpg",
      externalUrl: "https://www.amazon.es/baby-reg/crisypalma-vidaurrazaga-febrero-2026-alcobendas/113BYRXA2QSRL",
      type: GiftType.external,
    },
    {
      title: "Crema para pañal de caléndula Weleda",
      categorySlug: "cambio-de-panales",
      description: "Crema Pañal de Caléndula, Calma y Protege el Culito del Bebé. [Amazon hace un 15% de descuento si se compra en la lista]",
      imageUrl: "/Products/Weleda.jpg",
      externalUrl: "https://www.amazon.es/baby-reg/crisypalma-vidaurrazaga-febrero-2026-alcobendas/113BYRXA2QSRL",
      type: GiftType.external,
    },
    // Alimentación
    {
      title: "Silla Inglesina",
      categorySlug: "alimentacion",
      description: "Inglesina Fast, Asiento de Mesa Plegable, Beige (Desert Beige), Fácil de Transportar, Hasta 15 kg. [DESERT BEIGE o PINE GREEN]",
      imageUrl: "/Products/Inglesina.jpg",
      externalUrl: "https://www.amazon.es/Inglesina-Asiento-Plegable-Transportar-Instalaci%C3%B3n/dp/B0DMFFJPGG?colid=113BYRXA2QSRL&coliid=I33R06PSO0LXZ1",
      type: GiftType.external,
    },
    {
      title: "Calentador de Biberones Momcozy",
      categorySlug: "alimentacion",
      description: "Calentador de biberones Nutri Momcozy, 9 en 1 con luz nocturna, control preciso de temperatura.",
      imageUrl: "/Products/Calentador.jpg",
      externalUrl: "https://www.amazon.es/Calentador-biberones-nocturna-temperatura-nutrientes/dp/B0DLP2GXLJ?colid=113BYRXA2QSRL&coliid=I1YAVZLFT3VR7N",
      type: GiftType.external,
    },
    {
      title: "BEABA Babycook Neo",
      categorySlug: "alimentacion",
      description: "Robot de cocina infantil, tritura, cocina y cuece al vapor. Azul oscuro. [Amazon hace un 15% de descuento si se compra en la lista]",
      imageUrl: "/Products/Robot.jpg",
      externalUrl: "https://www.amazon.es/baby-reg/crisypalma-vidaurrazaga-febrero-2026-alcobendas/113BYRXA2QSRL",
      type: GiftType.external,
    },
    {
      title: "Moonkie Tableware",
      categorySlug: "alimentacion",
      description: "Set de alimentación con nombre.",
      imageUrl: "/Products/Tableware.png",
      externalUrl: "https://moonkieshop.com/products/first-bites-gift-set-croissant-ivory?variant=44761729892605",
      type: GiftType.external,
    },
    {
      title: "Moonkie Cup",
      categorySlug: "alimentacion",
      description: "Vasos de silicona sin BPA especial para bebés.",
      imageUrl: "/Products/Cups.png",
      externalUrl: "https://moonkieshop.com/products/first-open-cup?variant=46085590384893",
      type: GiftType.external,
    },
    {
      title: "Moonkie Food Feeder",
      categorySlug: "alimentacion",
      description: "Conos de silicona para alimentar a bebés.",
      imageUrl: "/Products/Food_feeder.png",
      externalUrl: "https://moonkieshop.com/products/baby-food-feeder?variant=45675227382013",
      type: GiftType.external,
    },
    {
      title: "Platos para bebé antideslizantes",
      categorySlug: "alimentacion",
      description: "Moonkie 3 platos infantiles de silicona con tapa platos para bebé antideslizantes, sin BPA. [Amazon hace descuento si se compra en la lista]",
      imageUrl: "/Products/platos.jpg",
      externalUrl: "https://www.amazon.es/baby-reg/crisypalma-vidaurrazaga-febrero-2026-alcobendas/113BYRXA2QSRL",
      type: GiftType.external,
    },
    // Lactancia
    {
      title: "Capa de Lactancia",
      categorySlug: "lactancia",
      description: "Pañuelo Lactancia Materna, Capa de Lactancia con Correas Ajustables, Muselina Caqui.",
      imageUrl: "/Products/Muselina_pecho.jpg",
      externalUrl: "https://www.amazon.es/Aolso-Lactancia-Ajustables-Privacidad-Muselina-Caqui/dp/B0CRS1WGGZ?colid=113BYRXA2QSRL&coliid=I3692A8CJW2WT",
      type: GiftType.external,
    },
    {
      title: "Bolsas de almacenamiento de leche",
      categorySlug: "lactancia",
      description: "200 bolsas de almacenamiento momcozy con detección de temperatura, 180ml.",
      imageUrl: "/Products/Bolsas_leche.jpg",
      externalUrl: "https://www.amazon.es/dp/B0CGKYQFMD/ref=br_dsk_yr_itemdt_dp?colid=113BYRXA2QSRL&coliid=I1SZMVGRAGUZL2",
      type: GiftType.external,
    },
    // Salud e Higiene
    {
      title: "Termómetro para bebés",
      categorySlug: "salud-e-higiene",
      description: "Termómetro de Frente, Digital, Médico. Infrarrojo sin contacto.",
      imageUrl: "/Products/Termometro.jpg",
      externalUrl: "https://www.amazon.es/Term%C3%B3metro-Digital-Instant%C3%A1nea-Pantalla-femometer/dp/B0BXSGH9QC?colid=113BYRXA2QSRL&coliid=IR0CNT9OFG0YV",
      type: GiftType.external,
    },
    // Removed Cascos de Bebé antirruido from Salud e Higiene
    {
      title: "Lima de Uñas Eléctrica",
      categorySlug: "salud-e-higiene",
      description: "Momcozy Lima de Uñas Eléctrica para Bebés, Recargable con Luz LED, 7 Cabezales.",
      imageUrl: "/Products/Lima.jpg",
      externalUrl: "https://www.amazon.es/dp/B0F9F5G343/ref=br_dsk_yr_itemdt_dp?colid=113BYRXA2QSRL&coliid=I7DDF4A5FWWP2",
      type: GiftType.external,
    },
    {
      title: "Limpiador bucal",
      categorySlug: "salud-e-higiene",
      description: "Moonkie Kit de limpiador bucal y cepillo de diente para bebés desde 3 meses.",
      imageUrl: "/Products/limpiador.jpg",
      externalUrl: "https://www.amazon.es/Moonkie-Cepillo-Dientes-Dedales-Silicona/dp/B0BB285D3H?colid=113BYRXA2QSRL&coliid=I3BDKXGC5NPGLQ",
      type: GiftType.external,
    },
    {
      title: "Cepillos de baño de bambú",
      categorySlug: "salud-e-higiene",
      description: "Juego de cepillos de baño de bambú, mangos largos con 2 cabezales de cepillo extraíbles.",
      imageUrl: "/Products/cepillo.jpg",
      externalUrl: "https://www.amazon.es/dp/B0DY1KR3S8/ref=br_dsk_yr_itemdt_dp?colid=113BYRXA2QSRL&coliid=IC4B7OZE605F0",
      type: GiftType.external,
    },
    {
      title: "Kit de Limpieza de biberones",
      categorySlug: "salud-e-higiene",
      description: "Momcozy Juego de cepillos 7 en 1 para biberones.",
      imageUrl: "/Products/kit_limpieza.jpg",
      externalUrl: "https://www.amazon.es/cepillos-biberones-Completo-Limpieza-dispensador/dp/B0DFM9SQWC?colid=113BYRXA2QSRL&coliid=I3SV32D91W6JDS",
      type: GiftType.external,
    },
    // Removed Dentición category, moved items to Otros if applicable
    // Koala Teether -> Otros
    {
      title: "Koala Teether",
      categorySlug: "otros",
      description: "2-1 Koala Teether",
      imageUrl: "/Products/Koala.png",
      externalUrl: "https://moonkieshop.com/collections/baby-play-toys/products/teether-koala?variant=47095091134717",
      type: GiftType.external,
    },
    // Otros
    {
      title: "Rockit Rocker",
      categorySlug: "otros",
      description: "Rockit Rocker recargable - Ayuda para dormir para bebés, balancea suavemente cualquier cochecito.",
      imageUrl: "/Products/rockit.jpg",
      externalUrl: "https://www.amazon.es/baby-reg/crisypalma-vidaurrazaga-febrero-2026-alcobendas/113BYRXA2QSRL",
      type: GiftType.external,
    },
    {
      title: "Espejo coche",
      categorySlug: "otros",
      description: "Funbliss Espejo Coche Bebé Asiento Trasero, 360° Rotación.",
      imageUrl: "/Products/espejo.jpg",
      externalUrl: "https://www.amazon.es/baby-reg/crisypalma-vidaurrazaga-febrero-2026-alcobendas/113BYRXA2QSRL",
      type: GiftType.external,
    },
    {
      title: "Cascos Bebé Antirruido (Rosa)",
      categorySlug: "otros",
      description: "Alpine Muffy Baby Confort - Cascos Bebé Antirruido, Rosa.",
      imageUrl: "/Products/cascos.jpg",
      externalUrl: "https://www.amazon.es/baby-reg/crisypalma-vidaurrazaga-febrero-2026-alcobendas/113BYRXA2QSRL",
      type: GiftType.external,
    },
    {
      title: "Utensilios de Cocina Montessori",
      categorySlug: "otros",
      description: "Dreamon Juego de Cuchillos Cocina para Niños, Utensilios de Cocina Montessori.",
      imageUrl: "/Products/chef.jpg",
      externalUrl: "https://www.amazon.es/dp/B0D1G89DCY/ref=br_dsk_yr_itemdt_dp?colid=113BYRXA2QSRL&coliid=I2WDHT4VFDBRFV",
      type: GiftType.external,
    },
    {
      title: "Taza de Silicona",
      categorySlug: "otros",
      description: "Mushie Snack Taza de Silicona | Fiambrera Infantil para Llevar. Shifting Sand.",
      imageUrl: "/Products/taza.jpg",
      externalUrl: "https://www.amazon.es/baby-reg/crisypalma-vidaurrazaga-febrero-2026-alcobendas/113BYRXA2QSRL",
      type: GiftType.external,
    },
    {
      title: "Arco de Escalada Montessori",
      categorySlug: "otros",
      description: "Arco de Escalada Montessori 3 en 1 para Niños.",
      imageUrl: "/Products/arco.jpg",
      externalUrl: "https://www.amazon.es/dp/B0CHFW3FQ4/ref=br_dsk_yr_itemdt_dp?colid=113BYRXA2QSRL&collid=I3KNJDMEJKF1CJ",
      type: GiftType.external,
    },
    // Add default Contribution Free gift
    {
      title: "Contribución Libre",
      categorySlug: "contribucion-libre",
      description: "¿Prefieres contribuir con la cantidad que desees? Tu generosidad, sin importar el monto, nos llena de alegría.",
      type: GiftType.custom,
      status: "available",
      imageUrl: null,
      externalUrl: null,
    }
  ];

  let i = 0;
  for (const gift of giftsData) {
    i++;
    const categoryId = categoryMap.get(gift.categorySlug);
    if (!categoryId) {
      console.warn(`Category not found for gift: ${gift.title} (${gift.categorySlug})`);
      continue;
    }

    await prisma.gift.create({
      data: {
        categoryId,
        title: gift.title,
        description: gift.description,
        imageUrl: gift.imageUrl,
        externalUrl: gift.externalUrl,
        type: gift.type || GiftType.external,
        status: (gift.status as any) || "available",
        order: i,
      },
    });
  }
  console.log(`✅ Created ${giftsData.length} gifts`);

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
