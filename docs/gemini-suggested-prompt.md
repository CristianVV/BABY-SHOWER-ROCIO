This is a sophisticated shift. We are taking the high-end"Apple-style" scrollytelling tech and applying it to a warm, intimate family context. I have rewritten the prompt to maintain the technical rigor of the original while pivoting the aesthetic and functional logic to match Rocio's baby shower registry.

### Updated Prompt for your Al Developer

### √ACT AS

A world-class Creative Developer\& UX Architect specializing in:

Next.js 14(App Router)

● Framer Motion\& Headless UI

● High-end, emotional"Scrollytelling" experiences

### 5 THE TASK

 Build a premium, private Baby Shower Gift Registry for Rocio.

Core mechanic: A"Warm Minimalism" landing page. The hero section features a scroll-linked image sequence(0-100 frames) of a soft, symbolic animation(e.g., a baby blanket unfolding, a flower blooming, or a nursery scene assembling) that transitions into a functional, elegant gift gallery.

### "VISUAL DIRECTION(Apple-Inspired Warmth)

Background:#FAF9F6(Off-white/Parchment) or#FDFCF0(Warm Cream).

● Background:\#FAF9F6(Off-white/Parchment) or\#FDFCF0(Warm Cream).● Typography:- Headings: A sophisticated, soft Serif(e.g., Cormorant Garamond or Outfit).

。Body: Inter or SF Pro(Clean, high legibility).

● Aesthetic: Emotionally soft, generous whitespace, rounded"bento-style" cards(rounded-3xl), and subtle micro-interactions. No cartoons, no loud colors.

### TECH STACK& LOGIC

●Framework: Next.js 14(App Router)+ TypeScript.

•Styling: Tailwind CSS.

● State Management: React useState/useContext for a lightweight Cart(no persistence needed beyond session).

• Communication: Lightweight WhatsApp APl integration for"Intent" confirmation.

### FUNCTIONAL SECTIONS TO GENERATE

### 1) Password Gate

Simple, elegant overlay.

● Shared password logic(e.g.,"Rocio2026").

● No user accounts; use localStorage to remember the session.

### 2) Scrollytelling Hero(Canvas-based)

Container: 400vh for the scroll range.

Animation: 120-frame.webp sequence preloaded.

Text Beats:

0-25%:"Welcome to Rocio's Baby Shower"

$$
\text{ 25-50%:"A celebration of new beginnings."}
$$

$$
\text{ 50-75%:"Help us prepare for our little one's arrival."}
$$

$$
\text{ 75-100%:(Sequence fades to reveal the Gift Gallery).}
$$

### 3) The Gift Gallery(The Core)

Three gift types represented in a clean grid:

1. Fundable Gifts: Show a progress bar. Allow guests to input a custom amount(min.€10).

2. External Gifts:"Buy on Amazon/Store" button+"I've bought this" toggle.

3. Custom Contribution: A"Free choice" card for general support.

Visual States: Must clearly label cards as"Available,""Partially Funded," or"Completed."

### 4) The"Intent" Checkout Flow

A slide-over or modal"Cart" that collects:

Name, Phone, and a Message for the Baby.

● Name, Phone, and a Message for the Baby.● Payment Instruction Screen: Instead of a gateway, show:

Bizum:[Phone Number]

Revolut:[Link]

Bancolombia:[QR/Details]

● Final Step: A"Confirm via WhatsApp" button that generates a pre-filled message to the host with the gift details.

● Frictionless: Every click must feel responsive. Use AnimatePresence for modal transitions.

● Mobile First: The gift grid must be a single column on mobile with large, tappable buttons.

● The"Admin" Secret: A hidden route/admin(password-protected) to toggle gift statuses(Verified/Pending).

### c OUTPUT REQUIREMENTS

1. app/page.tsx: The main scrollytelling and gallery entry point.

2.components/GiftCard.tsx: Reusable component handling the 3 gift types and progress bars.

3.components/CheckoutModal.tsx: The flow for collecting guest info and showing payment instructions.

4. components/ScrollCanvas.tsx: The high-performance image sequence logic.

5.lib/types.ts: TypeScript interfaces for Gifts and Contributions.

### CRITICAL GUIDELINE

The website records intent, not payment. The UI must explicitly state:"Your contribution will appear once the family verifies the transfer."This preserves the intimate, non-commercial feel.

Would you like me to generate the specific TypeScript interfaces for the"Three Gift Types" so the data structure is ready for the code?