import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAuth } from "../../contexts/useAuth";

const AdminNavBar = () => {
    const { user, logout } = useAuth()

    return (
        <div className="flex items-center justify-between px-6 md:px-10 h-16 border-b border-gray-300/30">
            <Link to = '/'>
                <img src={assets.logo} alt="logo"  className="w-36 h-auto"/>
            </Link>
            <div className="flex items-center gap-4 text-sm">
                <div className="text-right">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{user?.role}</p>
                </div>
                <button
                    onClick={logout}
                    className="rounded-full border border-white/15 px-4 py-2 transition hover:bg-white/10"
                >
                    Logout
                </button>
            </div>
        </div>
    )
}

export default AdminNavBar
