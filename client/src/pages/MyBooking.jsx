import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Loading from '../components/Loading'
import BlurCircle from '../components/BlurCircle'
import timeFormat from '../lib/timeFormat.js'
import { dateFormat } from '../lib/dateFormat.js'
import { service } from '../services'
import { useAuth } from '../contexts/useAuth'
import toast from 'react-hot-toast'
import BookingPaymentPanel from '../components/BookingPaymentPanel'

const MyBooking = () => {
  const currency = import.meta.env.VITE_CURRENCY
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activePaymentId, setActivePaymentId] = useState(null)
  const [submittingPayment, setSubmittingPayment] = useState(false)
  const { user } = useAuth()
  const location = useLocation()

  const handlePaymentSubmit = async (bookingId, paymentData) => {
    try {
      setSubmittingPayment(true)
      const updatedBooking = await service.submitPayment({
        bookingId,
        userId: user.id,
        ...paymentData,
      })
      setBookings((prev) => prev.map((item) => (item._id === bookingId ? updatedBooking : item)))
      setActivePaymentId(null)
      toast.success(
        paymentData.method === 'online'
          ? 'Online payment confirmed'
          : 'Direct payment info saved',
      )
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSubmittingPayment(false)
    }
  }

  useEffect(()=>{
    let cancelled = false

    service.getMyBookings(user.id).then((data) => {
      if (cancelled) return
      setBookings(data)
      setIsLoading(false)
    })

    return () => {
      cancelled = true
    }
  },[user.id, location.key])

  return !isLoading ? (
    <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]'>
      <BlurCircle top="100px" left="100px" />
      <div>
        <BlurCircle bottom='0px' left='600px' />
      </div>
      <h1 className='text-lg font-semibold mb-4'>My bookings</h1>

      {bookings.map((item, index) => (
        <div key={index} className='mt-4 max-w-3xl rounded-3xl border border-primary/20 bg-primary/8 p-2'>
          <div className='flex flex-col justify-between md:flex-row'>
            <div className='flex flex-col md:flex-row'>
              <img
                src={item.show.movie.poster_path}
                alt=''
                className='aspect-video h-auto rounded-2xl object-cover object-bottom md:max-w-45'
              />
              <div className='flex flex-col p-4'>
                <div className='flex items-center gap-3'>
                  <p className='text-lg font-semibold'>{item.show.movie.title}</p>
                  <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${
                    item.isPaid
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : item.paymentMethod === 'direct'
                        ? 'bg-amber-500/15 text-amber-300'
                        : 'bg-rose-500/15 text-rose-300'
                  }`}>
                    {item.isPaid ? 'Paid' : item.paymentMethod === 'direct' ? 'Pending direct pay' : 'Unpaid'}
                  </span>
                </div>
                <p className='text-sm text-gray-400'>{timeFormat(item.show.movie.runtime)}</p>
                <p className='mt-auto text-sm text-gray-400'>{dateFormat(item.show.showDateTime)}</p>
                {item.show.isWednesday && (
                  <p className='mt-2 text-sm text-emerald-300'>
                    Wednesday deal applied: 30% off
                  </p>
                )}
                {item.paymentMethod && (
                  <p className='mt-2 text-sm text-gray-500'>
                    Payment method: <span className='text-gray-300'>{item.paymentMethod}</span>
                  </p>
                )}
                {item.contactPhone && (
                  <p className='text-sm text-gray-500'>
                    Phone: <span className='text-gray-300'>{item.contactPhone}</span>
                  </p>
                )}
              </div>
            </div>

            <div className='flex flex-col justify-between p-4 md:items-end md:text-right'>
              <div className='flex items-center gap-4'>
                <p className='mb-3 text-2xl font-semibold'>{currency}{item.amount}</p>
                {!item.isPaid && (
                  <button
                    onClick={() => setActivePaymentId((prev) => (prev === item._id ? null : item._id))}
                    className='mb-3 cursor-pointer rounded-full bg-primary px-4 py-1.5 text-sm font-medium'
                  >
                    {activePaymentId === item._id ? 'Close' : 'Pay Now'}
                  </button>
                )}
              </div>
              <div className='text-sm'>
                <p><span className='text-gray-400'>Total Tickets:</span> {item.bookedSeats.length}</p>
                <p><span className='text-gray-400'>Seat Number:</span> {item.bookedSeats.join(", ")}</p>
                <p><span className='text-gray-400'>Status:</span> {item.paymentStatus}</p>
              </div>
            </div>
          </div>

          {!item.isPaid && activePaymentId === item._id && (
            <BookingPaymentPanel
              booking={item}
              submitting={submittingPayment}
              onSubmit={(paymentData) => handlePaymentSubmit(item._id, paymentData)}
            />
          )}
        </div>
      ))}
    </div>
  ) : (
    <Loading />
  )
}

export default MyBooking
