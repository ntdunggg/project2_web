import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import Loading from '../components/Loading'
import { ArrowRightIcon, ClockIcon } from 'lucide-react'
import isoTimeFormat from '../lib/isoTimeFormat.js'
import toast from 'react-hot-toast'
import { service } from '../services'
import { useAuth } from '../contexts/useAuth'

const SeatLayout = () => {
  const groupRows = [["A", "B"], ["C", "D"], ["E","F"], ["G","H"], ["I","J"]]
  const {id, date} = useParams()
  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const [show, setShow] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const handleSeatClick = (seatId) =>{
    if(!selectedTime){
      return toast("Please select the time first")
    }
    if (selectedTime.occupiedSeats?.[seatId]) {
      return toast('This seat has already been booked')
    }
    if(!selectedSeats.includes(seatId) && selectedSeats.length > 4){
      return toast("Maximum 5 seats")
    }
    setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(seat => seat !== seatId) : [...prev, seatId])
  }

  const renderSeats = (row, count = 9) => (
    <div key={row} className='mt-2 flex gap-2'>
      <div className='flex flex-wrap items-center justify-center gap-2'>
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`

          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              disabled={Boolean(selectedTime?.occupiedSeats?.[seatId])}
              className={`h-8 w-8 rounded border border-primary/60 ${
                selectedTime?.occupiedSeats?.[seatId]
                  ? 'cursor-not-allowed bg-white/10 text-gray-500'
                  : selectedSeats.includes(seatId)
                    ? 'cursor-pointer bg-primary text-white'
                    : 'cursor-pointer'
              }`}>
              {seatId}
            </button>
          )
        })}
      </div>
    </div>
  )

  const handleCheckout = async () => {
    if (!selectedTime) {
      return toast('Please select the time first')
    }

    if (selectedSeats.length === 0) {
      return toast('Please select at least one seat')
    }

    setSubmitting(true)

    try {
      await service.bookSeats({
        showId: selectedTime._id,
        seats: selectedSeats,
        userId: user?.id,
      })
      toast.success('Booking created. Complete payment in My bookings.')
      navigate('/my-bookings')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(()=>{
    const loadShow = async () => {
      const [movie, schedule] = await Promise.all([
        service.getMovieById(id),
        service.getMovieSchedule(id),
      ])

      const nextShow = {
        movie,
        dateTime: schedule,
      }

      setShow(nextShow)
      const firstTime = schedule[date]?.[0] ?? null
      if (firstTime) {
        const detail = await service.getShowById(firstTime.showId)
        setSelectedTime(detail)
      }
    }

    loadShow()
  }, [id, date])

  return show ? (
    <div className='flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50'>
      <div className='w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30'>
        <p className='text-lg font-semibold px-6'>
          Available Timing
        </p>
        <div className='mt-5 space-y-1'>
          {(show.dateTime[date] || []).map((item) => (
            <div
              key={item.showId}
              onClick={async () => {
                setSelectedSeats([])
                const detail = await service.getShowById(item.showId)
                setSelectedTime(detail)
              }}
              className={`flex w-max cursor-pointer items-center gap-2 rounded-r-md px-6 py-2 transition ${selectedTime?.showDateTime === item.time ? 'bg-primary text-white' : 'hover:bg-primary/20'}`}
            >
              <ClockIcon className='w-4 h-4'/>
              <p className='text-sm'>
                { isoTimeFormat(item.time) }
              </p>
            </div>
          ))}
        </div>

        {selectedTime && (
          <div className='mt-8 px-6 text-sm text-gray-400'>
            <p>
              Price:{' '}
              {selectedTime.isWednesday ? (
                <>
                  <span className='line-through opacity-60'>{import.meta.env.VITE_CURRENCY}{selectedTime.showPrice}</span>
                  <span className='ml-2 text-emerald-300'>{import.meta.env.VITE_CURRENCY}{selectedTime.discountedPrice}</span>
                </>
              ) : (
                <span>{import.meta.env.VITE_CURRENCY}{selectedTime.showPrice}</span>
              )}
            </p>
            <p className='mt-1'>Booked seats: {Object.keys(selectedTime.occupiedSeats).length}</p>
            {selectedTime.isWednesday && (
              <p className='mt-2 text-emerald-300'>Wednesday shows get 30% off</p>
            )}
          </div>
        )}
      </div>

      <div className='relative flex-1 flex flex-col items-center max-md:mt-16'>
        <h1 className='text-2xl font-semibold mb-4'>
          Select your seat
        </h1>
        <img src={assets.screenImage} alt="screen" />
        <p className='text-gray-400 text-sm mb-6'>
          SCREEN SIDE
        </p>
        <div className='mb-8 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-300'>
          <div className='flex items-center gap-2'>
            <span className='h-3 w-3 rounded border border-primary/60 bg-transparent' />
            Available
          </div>
          <div className='flex items-center gap-2'>
            <span className='h-3 w-3 rounded border border-primary bg-primary' />
            Selected
          </div>
          <div className='flex items-center gap-2'>
            <span className='h-3 w-3 rounded border border-white/10 bg-white/10' />
            Booked
          </div>
        </div>
        <div className='flex flex-col items-center mt-10 text-xs text-gray-300'>
          <div className='grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6'>
            {groupRows[0].map(row => renderSeats(row))}
          </div>

          <div className='grid grid-cols-2 gap-11'>
            {groupRows.slice(1).map((group, idx)=>(
              <div key={idx}>
                {group.map(row => renderSeats(row))}
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleCheckout} 
        disabled={submitting}
        className='flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95 disabled:cursor-not-allowed disabled:opacity-70'>
          {submitting ? 'Booking...' : 'Proceed to checkout'}
          <ArrowRightIcon strokeWidth={4} className='w-4 h-4' />
        </button>

      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default SeatLayout
