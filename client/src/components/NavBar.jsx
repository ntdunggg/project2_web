import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { LogOutIcon, MenuIcon, XIcon } from 'lucide-react'
import { useAuth } from '../contexts/useAuth'

const NavBar = () => {

  const [isOpen ,setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className='fixed top-0 left-0 z-50 flex w-full items-center justify-between px-4 py-4 sm:px-6 md:px-16 lg:px-36'>
        <Link to='/' className='max-md:flex-1'>
            <img src={assets.logo} alt="" className='h-auto w-28 sm:w-32 md:w-36'/>
        </Link>

        <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium
        max-md:text-lg z-50 flex flex-col md:flex-row items-center
        max-md:justify-center gap-8 md:px-8 py-3 max-md:h-screen
        md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border
        border-gray-300/20 overflow-hidden transition-[width] 
        duration-300 ${isOpen ? 'max-md:w-full' : 'max-md:w-0'}`}>
          <XIcon className='md:hidden absolute top-6 right-6 w-6 h-6 
          cursor-pointer' onClick={()=> setIsOpen(!isOpen)}/>

          <Link onClick={()=> {scrollTo(0,0); setIsOpen(false)}} to='/'>Home</Link>
          <Link onClick={()=> {scrollTo(0,0); setIsOpen(false)}} to='/movies'>Movies</Link>
          {user?.role === 'customer' && (
            <Link onClick={()=> {scrollTo(0,0); setIsOpen(false)}} to='/my-bookings'>My Bookings</Link>
          )}
          {user?.role === 'admin' && (
            <Link onClick={()=> {scrollTo(0,0); setIsOpen(false)}} to='/admin'>Dashboard</Link>
          )}
        </div>

        <div className='flex items-center gap-3 sm:gap-5 md:gap-8'>
            {
              !user ? (
                <button onClick={() => navigate('/login')} className='px-4 py-1 sm:px-7 sm:py-2 bg-rose-400 
                hover:bg-rose-500 transition rounded-full font-medium cursor-pointer'>
                  Login
                </button>
              ): (
                <div className='flex items-center gap-2 text-sm'>
                  <div className='hidden text-right md:block'>
                    <p className='font-medium'>{user.name}</p>
                    <p className='text-xs uppercase tracking-[0.2em] text-gray-400'>{user.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className='rounded-full border border-white/15 px-3 py-2 text-gray-200 transition hover:bg-white/10'
                  >
                    <LogOutIcon className='h-4 w-4' />
                  </button>
                </div>
              )
            }
        </div>
        <MenuIcon className='md:hidden w-8 h-8 cursor-pointer' onClick={()=> setIsOpen(!isOpen)}/>
    </div>
  )
}

export default NavBar
