import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BlurCircle from '../components/BlurCircle'
import Loading from '../components/Loading'
import TicketCard from '../components/TicketCard'
import { service } from '../services'
import { useAuth } from '../contexts/useAuth'

const MyTickets = () => {
  const { user } = useAuth()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    service.getMyTickets(user.id).then((data) => {
      if (cancelled) return
      setTickets(data)
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [user.id])

  if (loading) {
    return <Loading />
  }

  return (
    <div className='relative min-h-[80vh] px-6 pt-30 md:px-16 md:pt-40 lg:px-40'>
      <BlurCircle top='80px' left='120px' />
      <BlurCircle bottom='40px' right='100px' />

      <div className='relative z-10'>
        <p className='text-sm uppercase tracking-[0.3em] text-primary'>Customer</p>
        <h1 className='mt-2 text-3xl font-semibold'>My tickets</h1>

        {tickets.length === 0 ? (
          <div className='mt-8 max-w-2xl rounded-3xl border border-primary/20 bg-primary/8 p-8'>
            <p className='text-lg font-medium'>No paid tickets yet</p>
            <p className='mt-2 text-sm text-gray-400'>
              Complete payment in your bookings first, then tickets and QR codes will appear here.
            </p>
            <Link
              to='/my-bookings'
              className='mt-5 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition hover:bg-primary-dull'
            >
              Go to My Bookings
            </Link>
          </div>
        ) : (
          <div className='mt-8 space-y-6'>
            {tickets.map((ticket) => (
              <TicketCard key={ticket._id} booking={ticket} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyTickets
