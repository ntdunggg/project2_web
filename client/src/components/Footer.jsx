import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { Facebook, Instagram, Github, Twitter } from 'lucide-react'
import { useAuth } from '../contexts/useAuth'

const guestLinks = [
  { label: 'Home', to: '/' },
  { label: 'Movies', to: '/movies' },
]

const customerLinks = [
  { label: 'Home', to: '/' },
  { label: 'Movies', to: '/movies' },
  { label: 'My Bookings', to: '/my-bookings' },
]

const adminLinks = [
  { label: 'Home', to: '/' },
  { label: 'Movies', to: '/movies' },
  { label: 'Dashboard', to: '/admin' },
]

const socialLinks = [
  { label: 'Facebook', href: 'https://facebook.com', icon: Facebook },
  { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { label: 'Twitter', href: 'https://x.com', icon: Twitter },
  { label: 'GitHub', href: 'https://github.com', icon: Github },
]

const Footer = () => {
  const { user } = useAuth()

  const footerLinks = user?.role === 'admin'
    ? adminLinks
    : user?.role === 'customer'
      ? customerLinks
      : guestLinks

  return (
    <footer className='mt-20 border-t border-white/10 bg-[#090808] px-6 py-12 text-white/70 md:px-16 lg:px-24 xl:px-44'>
      <div className='flex flex-col gap-10 md:flex-row md:items-start md:justify-between'>
        <div className='max-w-md'>
          <Link to='/' onClick={() => scrollTo(0, 0)} className='inline-block'>
            <img src={assets.logo} alt='NtdFilm logo' className='w-32' />
          </Link>
          <p className='mt-4 text-sm leading-6 text-white/60'>
            NtdFilm helps you discover movies, watch trailers, and book tickets with a cleaner browsing experience.
          </p>
        </div>

        <div>
          <p className='text-sm font-semibold uppercase tracking-[0.2em] text-white'>Explore</p>
          <div className='mt-4 flex flex-col gap-3 text-sm'>
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => scrollTo(0, 0)}
                className='transition hover:text-white'
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className='text-sm font-semibold uppercase tracking-[0.2em] text-white'>Connect</p>
          <div className='mt-4 flex items-center gap-3'>
            {socialLinks.map((item) => {
              const IconComponent = item.icon

              return (
                <a
                  key={item.label}
                  href={item.href}
                  target='_blank'
                  rel='noreferrer'
                  aria-label={item.label}
                  className='rounded-full border border-white/10 p-2 transition hover:border-white/30 hover:text-white'
                >
                  <IconComponent className='h-4 w-4' />
                </a>
              )
            })}
          </div>
        </div>
      </div>

      <div className='mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/50 md:flex-row md:items-center md:justify-between'>
        <p>Copyright {new Date().getFullYear()} NtdFilm. All rights reserved.</p>
        <p>Built for browsing trailers and booking movie tickets faster.</p>
      </div>
    </footer>
  )
}

export default Footer
