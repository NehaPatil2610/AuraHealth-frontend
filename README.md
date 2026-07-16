# 🩺 AuraHealth — Precision Care Platform (V2.0-Beta)

AuraHealth is a premium, cinematic clinical management ecosystem. Designed for the modern era, it provides a seamless, ultra-responsive interface for patients and healthcare providers to manage appointments, access medical records, and oversee clinical practice with total data privacy.

---

## ✨ Interface Highlights

* **Cinematic Design System:** Built on an obsidian foundation (`#09090b`) with intelligent emerald (`#10b981`) accents and subtle glassmorphic (`backdrop-blur`) data panels.
* **Floating Dock Navigation:** A centralized, low-profile navigation island that declutters the viewport, creating an expansive and immersive user workspace.
* **Intelligent Mesh Backgrounds:** A dynamic, grid-responsive mesh gradient system providing a high-end, premium aesthetic for landing and workspace views.
* **Real-Time State Integration:** A responsive, stateful interface featuring real-time clinical notification feeds and seamless theme toggling.

---

## 📂 Project Architecture

```text
src/
  ├── components/       # Core UI Primitives (Floating Navbar Dock, Appointment Rows, Footer)
  ├── contexts/         # Global State Engines (Auth, Notification, Theme)
  ├── layouts/          # Viewport Master Containers (DashboardLayout)
  ├── views/            
  │   ├── doctor/       # Physician-side clinical management logic
  │   └── patient/      # Auth gateways, Patient Workspaces, Medical Record access
  ├── App.jsx           # Master Routing & Session Enforcement
  └── index.css         # Tailwind directives & Custom Blur/Gradient definitions
