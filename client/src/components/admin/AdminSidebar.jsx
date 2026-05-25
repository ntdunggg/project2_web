import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";
import { LayoutDashboardIcon, ListCollapseIcon, ListIcon, PlaySquareIcon } from "lucide-react";
import { useAuth } from "../../contexts/useAuth";

const AdminSidebar = () => {
    const { user } = useAuth()

    const AdminNavlinks = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboardIcon},
        { name: 'Add Shows', path: '/admin/add-shows', icon: PlaySquareIcon},
        { name: 'List Shows', path: '/admin/list-shows', icon: ListIcon },
        { name: 'List Bookings', path: '/admin/list-bookings' , icon:ListCollapseIcon },
    ]

    return (
        <div className='h-[calc(100vh-64px)] flex w-full max-w-13 flex-col items-center border-r border-gray-300/20 pt-8 text-sm md:max-w-60'>
            <img className='mx-auto h-9 w-9 rounded-full md:h-14 md:w-14' src={assets.profile} alt="sidebar" />
            <p className='mt-2 text-base max-md:hidden'>{user?.name}</p>
            <div className='w-full'>
                {AdminNavlinks.map((link, index) => (
                    <NavLink
                        key={index}
                        to={link.path}
                        end
                        className={({ isActive }) =>
                            `relative flex w-full items-center gap-2 py-2.5 text-gray-400 first:mt-6 max-md:justify-center md:pl-10 ${isActive ? 'bg-primary/15 text-primary group' : ''}`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <link.icon className="h-5 w-5" />
                                <p className="max-md:hidden">{link.name}</p>
                                <span className={`absolute right-0 h-10 w-1.5 rounded-l ${isActive ? 'bg-primary' : ''}`} />
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </div>
    )
}

export default AdminSidebar
