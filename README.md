# 🎬 QuickShow — Movie Ticket Booking App

A modern, full-featured movie ticket booking web application built with **React + Vite** and **TailwindCSS v4**. QuickShow lets users browse movies, select seats, book tickets, and manage their reservations — all in a sleek, responsive UI.

---

## ✨ Features

### 👥 Customer
- 🏠 **Home** — Browse featured movies and trailers
- 🎞️ **Movies** — Explore all available movies
- 🎟️ **Seat Selection** — Interactive seat layout for booking
- 📋 **My Bookings** — View and manage your bookings
- 🎫 **My Tickets** — Access your confirmed tickets
- ❤️ **Favorites** — Save movies you love

### 🛠️ Admin
- 📊 **Dashboard** — Overview of the platform
- ➕ **Add Shows** — Schedule new movie screenings
- 📋 **List Shows** — Manage all scheduled shows
- 📦 **List Bookings** — View all customer bookings

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI Framework |
| [Vite 7](https://vite.dev/) | Build Tool & Dev Server |
| [TailwindCSS v4](https://tailwindcss.com/) | Styling |
| [React Router v7](https://reactrouter.com/) | Client-side Routing |
| [Clerk](https://clerk.com/) | Authentication |
| [Lucide React](https://lucide.dev/) | Icons |
| [React Hot Toast](https://react-hot-toast.com/) | Notifications |
| [React Player](https://github.com/CookPete/react-player) | Video/Trailer Playback |

---

## 📁 Project Structure

```
quickshow/
└── client/               # Frontend React application
    ├── public/           # Static assets
    └── src/
        ├── components/   # Reusable UI components
        │   └── admin/    # Admin-specific components
        ├── pages/        # Page-level components
        │   └── admin/    # Admin pages
        ├── contexts/     # React Context (Auth, etc.)
        ├── services/     # API & data services
        ├── lib/          # Utility functions
        └── assets/       # Images, SVGs
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- npm or yarn

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
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
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

## 📄 License

This project is for educational purposes.
