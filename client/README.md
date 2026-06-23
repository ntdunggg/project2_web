# 🎬 NtdFilm — Movie Ticket Booking App

A modern movie ticket booking web application built with **React + Vite** and **TailwindCSS v4**. NtdFilm lets users browse movies, select seats, book tickets, and manage their reservations — all in a sleek, responsive UI.

---

## ✨ Features

### 👥 Customer
- 🏠 **Home** — Browse currently showing movies in a hero slider
- 🎞️ **Movies** — Explore all available movies
- 🎟️ **Seat Selection** — Interactive seat layout for booking
- 📋 **My Bookings** — View and manage your bookings
- 💳 **Payment** — Pay via VietQR (online) or leave contact info for direct payment

### 🛠️ Admin
- 📊 **Dashboard** — Overview of revenue, bookings, and upcoming shows
- ➕ **Add Shows** — Schedule new movie screenings (cannot schedule in the past)
- 📋 **List Shows** — View and delete scheduled shows
- 📦 **List Bookings** — View all customer bookings and confirm direct payments

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 19 | UI Framework |
| [Vite](https://vite.dev/) | 7 | Build Tool & Dev Server |
| [TailwindCSS](https://tailwindcss.com/) | v4 | Styling |
| [React Router](https://reactrouter.com/) | v7 | Client-side Routing |
| [Lucide React](https://lucide.dev/) | latest | Icons |
| [React Hot Toast](https://react-hot-toast.com/) | latest | Notifications |

---

## 🔐 Authentication

Two built-in demo accounts:

| Role | Email | Password |
|---|---|---|
| Customer | `customer@test.com` | `password` |
| Admin | `admin@test.com` | `password` |

Session is persisted in `localStorage` under the key `ntdfilm_current_user`.

---

## 💾 Data Storage

All data is stored client-side — no backend needed:

| Data | Storage |
|---|---|
| Users, Shows, Bookings | `localStorage` (keys prefixed with `ntdfilm_`) |
| Movie poster / backdrop images | `IndexedDB` (`ntdfilm-media-db`) |

Past shows are **automatically purged** on app load. Admin cannot create shows with a past date/time.

---

## 📁 Project Structure

```
quickshow/
└── client/               # Frontend React application
    ├── index.html
    └── src/
        ├── assets/       # Logo, images, mock data
        ├── components/   # Reusable UI components
        │   └── admin/    # Admin-specific components
        ├── contexts/     # React Context (Auth)
        ├── lib/          # Utility functions (date, time formatting)
        ├── pages/        # Page-level components
        │   └── admin/    # Admin pages
        └── services/     # Mock data service & IndexedDB storage
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- npm

### Installation & Run

```bash
# Navigate to the client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be running at `http://localhost:5173`

### Build for Production

```bash
cd client
npm run build
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `client/` directory:

```env
# Currency symbol displayed throughout the app
VITE_CURRENCY=₫
```

---

## 📜 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Dev Server | `npm run dev` | Start local development server |
| Build | `npm run build` | Build for production |
| Preview | `npm run preview` | Preview production build |
| Lint | `npm run lint` | Run ESLint |

---
