# AI-First Agentic Development Brief  
**Project:** *Baby Shower de Rocío – Private Gift Registry Platform*

## 0. Mission Statement (System-Level Intent)

This project is a **private, non-commercial, emotionally driven web application** designed to facilitate collaborative baby shower gifting with **manual payment reconciliation** and **admin verification**.

The system prioritizes:
- Minimal friction
- Emotional clarity
- Privacy by default
- Operational simplicity

This is **not** an e-commerce platform.  
This is **not** a fintech product.  
This is a **family coordination interface**.

All agents must optimize for **clarity, trust, and ease of use**, not technical sophistication.

---

## 1. Operating Environment & Tooling

### Primary tools
- **Google Anti-Gravity / Cloud Code**  
- **Claude Code**

---

## 2. Agent Roles & Responsibilities

### 🧠 @SystemArchitect
- Overall architecture
- Hosting + database defaults
- Enforce simplicity

### 🎨 @UXEmotionDesigner
- Visual language
- Emotional tone
- Apple-like minimalism

### 🧩 @FrontendAgent
- Guest landing (SPA)
- Gift gallery, cart, checkout
- Mobile-first UX

### 🗂️ @StateLogicAgent
- Gift & contribution states
- Prevent race conditions

### 🔐 @AccessControlAgent
- Guest password
- Admin password
- Lightweight sessions

### 🧑‍💼 @AdminOpsAgent
- Admin dashboard
- Gift & contribution management

### 📲 @MessagingIntegrationAgent
- WhatsApp deep links
- Pre-filled messages

---

## 3. Conceptual Model

Guests express intent → Payments happen externally → Admin verifies → UI reflects truth.

---

## 4. User Access Model

- Guest: shared password, anonymous
- Admin: single password, full control

---

## 5. Guest-Facing Experience

### Hero
- Image
- Gratitude text
- Event info placeholder (Feb 2026, Alcobendas, Madrid)

### Gift Gallery
- Image, title, category
- Total value
- Progress bar
- State

---

## 6. Gift Types

### Fundable Gifts
- Min €10
- Multiple contributors
- States: Pending / Verified / Rejected

### External Purchase
- Redirect to store
- Post-purchase confirmation
- Admin verifies

### Custom Gift
- Free amount
- Message to baby

---

## 7. Cart & Checkout

- Multiple gifts
- Single checkout
- Collect contact + message
- Show payment instructions

---

## 8. Payment Model

- Bizum (phone)
- Revolut (link)
- Bancolombia (QR, COP)
- Manual verification only

---

## 9. Contribution Lifecycle

- Pending → Verified → Rejected
- Only verified sums affect progress

---

## 10. Privacy

- Guests anonymous
- Admin sees all
- Optional anonymous timeline

---

## 11. WhatsApp Integration

Auto-generated message to **+34 649 22 55 90**

---

## 12. Admin Dashboard

- CRUD gifts
- Multiple images
- Verify / reject contributions
- Mark gifts completed / purchased / hidden

---

## 13. Non-Goals

- No accounts
- No payment gateways
- No emails
- No compliance automation

---

## 14. Success Criteria

- Gift completed in < 2 minutes
- Zero confusion
- Emotional, calm, personal UX
