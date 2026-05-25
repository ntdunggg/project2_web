import React, { useMemo, useState } from 'react'
import { BanknoteIcon, CheckCircle2Icon, CopyIcon, LandmarkIcon, QrCodeIcon, WalletCardsIcon } from 'lucide-react'
import toast from 'react-hot-toast'

const buildQrCells = (seed) => {
  const chars = `${seed}quickshow-payment`
  return Array.from({ length: 121 }, (_, index) => {
    const code = chars.charCodeAt(index % chars.length)
    return ((code + index * 7) % 5) < 2
  })
}

const PaymentQr = ({ seed }) => {
  const cells = useMemo(() => buildQrCells(seed), [seed])

  return (
    <div className='rounded-2xl border border-white/10 bg-white p-3 shadow-sm'>
      <div className='grid grid-cols-11 gap-0.5'>
        {cells.map((cell, index) => (
          <div
            key={index}
            className={`h-3 w-3 rounded-[2px] ${cell ? 'bg-black' : 'bg-white'}`}
          />
        ))}
      </div>
    </div>
  )
}

const BookingPaymentPanel = ({ booking, onSubmit, submitting }) => {
  const [method, setMethod] = useState('online')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  const handleSubmit = async () => {
    await onSubmit({
      method,
      phone,
      address,
    })
  }

  const copyBankInfo = async () => {
    const text = `VCB 1020202601 QUICKSHOW ${booking._id}`
    await navigator.clipboard.writeText(text)
    toast.success('Bank transfer info copied')
  }

  return (
    <div className='mt-4 rounded-3xl border border-primary/20 bg-[#121010] p-5'>
      <div className='flex flex-col gap-3 md:flex-row'>
        <button
          type='button'
          onClick={() => setMethod('online')}
          className={`flex flex-1 items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
            method === 'online' ? 'border-primary bg-primary/15' : 'border-white/10 bg-white/5'
          }`}
        >
          <QrCodeIcon className='h-5 w-5 text-primary' />
          <div>
            <p className='font-medium'>Thanh toán online</p>
            <p className='text-sm text-gray-400'>Quét QR và xác nhận chuyển khoản</p>
          </div>
        </button>

        <button
          type='button'
          onClick={() => setMethod('direct')}
          className={`flex flex-1 items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
            method === 'direct' ? 'border-primary bg-primary/15' : 'border-white/10 bg-white/5'
          }`}
        >
          <BanknoteIcon className='h-5 w-5 text-primary' />
          <div>
            <p className='font-medium'>Thanh toán trực tiếp</p>
            <p className='text-sm text-gray-400'>Để lại thông tin liên hệ và thanh toán sau</p>
          </div>
        </button>
      </div>

      {method === 'online' ? (
        <div className='mt-5 grid gap-5 rounded-2xl border border-white/10 bg-black/20 p-4 md:grid-cols-[220px,1fr]'>
          <div className='flex items-center justify-center'>
            <PaymentQr seed={booking._id} />
          </div>

          <div>
            <div className='flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-primary'>
              <WalletCardsIcon className='h-4 w-4' />
              Online transfer
            </div>
            <div className='mt-4 space-y-3 text-sm text-gray-300'>
              <p className='flex items-center gap-2'>
                <LandmarkIcon className='h-4 w-4 text-primary' />
                Vietcombank - QUICKSHOW CINEMA
              </p>
              <p>Account number: <span className='font-medium text-white'>1020202601</span></p>
              <p>Amount: <span className='font-medium text-white'>{import.meta.env.VITE_CURRENCY}{booking.amount}</span></p>
              <p>Transfer note: <span className='font-medium text-white'>{booking._id}</span></p>
            </div>

            <div className='mt-4 flex flex-wrap gap-3'>
              <button
                type='button'
                onClick={copyBankInfo}
                className='inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm transition hover:bg-white/10'
              >
                <CopyIcon className='h-4 w-4' />
                Copy transfer info
              </button>
              <button
                type='button'
                onClick={handleSubmit}
                disabled={submitting}
                className='inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium transition hover:bg-primary-dull disabled:cursor-not-allowed disabled:opacity-70'
              >
                <CheckCircle2Icon className='h-4 w-4' />
                {submitting ? 'Processing...' : 'I have transferred'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className='mt-5 rounded-2xl border border-white/10 bg-black/20 p-4'>
          <div className='grid gap-4 md:grid-cols-2'>
            <label className='block text-sm'>
              <span className='mb-2 block text-gray-300'>Phone number</span>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder='Enter your phone number'
                className='w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none'
              />
            </label>

            <label className='block text-sm md:col-span-2'>
              <span className='mb-2 block text-gray-300'>Address</span>
              <textarea
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                rows={4}
                placeholder='Enter your address for direct payment/contact'
                className='w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none'
              />
            </label>
          </div>

          <div className='mt-4 flex flex-wrap items-center justify-between gap-3'>
            <p className='text-sm text-gray-400'>
              Booking will stay pending until you complete payment directly.
            </p>
            <button
              type='button'
              onClick={handleSubmit}
              disabled={submitting}
              className='rounded-full bg-primary px-5 py-2 text-sm font-medium transition hover:bg-primary-dull disabled:cursor-not-allowed disabled:opacity-70'
            >
              {submitting ? 'Saving...' : 'Save direct payment info'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingPaymentPanel
