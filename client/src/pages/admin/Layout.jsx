import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminNavBar from '../../components/admin/AdminNavbar'
import AdminSidebar from '../../components/admin/AdminSidebar'

const Layout = () => {
  return (
    <>
        <AdminNavBar />
        <div className='flex'>
            <AdminSidebar />
            <div className='flex-1 px-4 py-10 md:px-10 h-[cal(100vh-64px)] overflow-auto'>
                <Outlet />
            </div>
        </div>
    </>
  )
}

export default Layout
