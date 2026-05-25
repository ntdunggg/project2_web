import React, { useMemo } from 'react'
import { CalendarIcon, CheckCircle2Icon, QrCodeIcon, TicketIcon } from 'lucide-react'
import { dateFormat } from '../lib/dateFormat'

const buildQrCells = (seed) => {
  const chars = `${seed}quickshow-ticket`
  return Array.from({ length: 169 }, (_, index) => {
    const code = chars.charCodeAt(index % chars.length)
    return ((code * 3 + index * 11) % 7) < 3
  })
}

const TicketQr = ({ seed }) => {
  const cells = useMemo(() => buildQrCells(seed), [seed])

  return (
    <div className='rounded-2xl bg-white p-3'>
      <div className='grid grid-cols-13 gap-0.5'>
        {cells.map((cell, index) => (
          <div key={index} className={`h-2.5 w-2.5 rounded-[2px] ${cell ? 'bg-black' : 'bg-white'}`} />
        ))}
      </div>
    </div>
  )
}

const TicketCard = ({ booking }) => {
  return (
    <div className='overflow-hidden rounded-3xl border border-primary/20 bg-primary/8'>
      <div className='flex flex-col gap-6 p-5 md:flex-row'>
        <div className='md:w-52'>
          <img
            src={booking.show.movie.poster_path}
            alt={booking.show.movie.title}
            className='h-full w-full rounded-2xl object-cover'
          />
        </div>

        <div className='flex-1'>
          <div className='flex flex-wrap items-start justify-between gap-3'>
            <div>
              <p className='text-xs uppercase tracking-[0.25em] text-primary'>QuickShow Ticket</p>
              <h2 className='mt-2 text-2xl font-semibold'>{booking.show.movie.title}</h2>
            </div>
            <div className='rounded-full bg-emerald-500/15 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-300'>
              Paid
            </div>
          </div>

          <div className='mt-5 grid gap-3 text-sm text-gray-300 md:grid-cols-2'>
            <p className='flex items-center gap-2'>
              <CalendarIcon className='h-4 w-4 text-primary' />
              {dateFormat(booking.show.showDateTime)}
            </p>
            <p className='flex items-center gap-2'>
              <TicketIcon className='h-4 w-4 text-primary' />
              Seats: {booking.bookedSeats.join(', ')}
            </p>
            <p>Booking ID: <span className='font-medium text-white'>{booking._id}</span></p>
            <p>Amount paid: <span className='font-medium text-white'>{import.meta.env.VITE_CURRENCY}{booking.amount}</span></p>
          </div>

          {booking.show.isWednesday && (
            <p className='mt-4 text-sm text-emerald-300'>Wednesday 30% discount applied</p>
          )}

          <div className='mt-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 md:flex-row md:items-center md:justify-between'>
            <div>
              <div className='flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-primary'>
                <QrCodeIcon className='h-4 w-4' />
                Entry QR
              </div>
              <p className='mt-2 text-sm text-gray-400'>
                Show this code at the entrance for staff check-in.
              </p>
              <p className='mt-3 flex items-center gap-2 text-sm text-emerald-300'>
                <CheckCircle2Icon className='h-4 w-4' />
                Payment confirmed via {booking.paymentMethod}
              </p>
            </div>
            <TicketQr seed={`${booking._id}-${booking.bookedSeats.join('-')}`} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketCard
