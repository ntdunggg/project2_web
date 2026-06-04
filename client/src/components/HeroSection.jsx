import React, { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, CalendarIcon, ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { service } from '../services'
import Loading from './Loading'

const HeroSection = () => {
  const navigate = useNavigate()
  const [shows, setShows] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    service.getShows().then((data) => {
      if (cancelled) return
      setShows(data)
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [])

  const uniqueShows = useMemo(() => {
    const seenMovieIds = new Set()

    return shows.filter((show) => {
      if (seenMovieIds.has(show.movieId)) {
        return false
      }

      seenMovieIds.add(show.movieId)
      return true
    })
  }, [shows])

  const safeActiveIndex = uniqueShows.length === 0 ? 0 : activeIndex % uniqueShows.length
  const activeShow = useMemo(() => uniqueShows[safeActiveIndex] ?? null, [uniqueShows, safeActiveIndex])

  if (loading) {
    return <Loading />
  }

  if (!activeShow) {
    return (
      <div
        className='flex min-h-screen flex-col items-start justify-center gap-4 bg-cover bg-center px-4 pt-24 pb-10 sm:px-6 md:px-16 lg:px-36'
        style={{ backgroundImage: `url(${assets.backgroundImage})` }}
      >
        <h1 className='text-4xl font-semibold'>No Current Show</h1>
        <p className='max-w-lg text-gray-300'>There are no shows scheduled at the moment. Please check back later.</p>
      </div>
    )
  }

  return (
    <div
      className='relative flex min-h-screen flex-col items-start justify-center gap-4 overflow-hidden px-4 pt-24 pb-10 sm:px-6 md:px-16 lg:px-36'
    >
      <div
        key={activeShow._id}
        className='hero-fade absolute inset-0 bg-cover bg-center'
        style={{ backgroundImage: `linear-gradient(90deg, rgba(8,8,8,0.88) 0%, rgba(8,8,8,0.55) 45%, rgba(8,8,8,0.68) 100%), url(${activeShow.movie.backdrop_path || activeShow.movie.poster_path || assets.backgroundImage})` }}
      />

      <div key={`${activeShow._id}-content`} className='hero-content-fade relative z-10 max-w-3xl'>
        <p className='text-sm uppercase tracking-[0.35em] text-primary'>Now Showing</p>

        <h1 className='mt-4 max-w-full text-3xl font-semibold leading-tight sm:max-w-110 sm:text-4xl md:text-6xl md:leading-tight lg:text-[70px] lg:leading-18'>
          {activeShow.movie.title}
        </h1>

        <div className='mt-5 flex flex-wrap items-center gap-3 text-sm text-gray-300 sm:gap-4 sm:text-base'>
          <span>{activeShow.movie.genres.slice(0, 3).map((genre) => genre.name).join(' | ')}</span>
          <div className='flex items-center gap-1'>
            <CalendarIcon className='h-4 w-4' /> {new Date(activeShow.showDateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <div className='flex items-center gap-1'>
            <ClockIcon className='h-4 w-4' /> {Math.floor(activeShow.movie.runtime / 60)}h {activeShow.movie.runtime % 60}m
          </div>
        </div>

        <p className='mt-5 max-w-full text-sm text-gray-300 sm:max-w-xl sm:text-base'>
          {activeShow.movie.overview}
        </p>

        <div className='mt-7 flex flex-wrap items-center gap-3'>
          <button
            onClick={() => navigate(`/movies/${activeShow.movie._id}`)}
            className='flex cursor-pointer items-center gap-1 rounded-full bg-rose-400 px-5 py-2.5 text-sm font-medium transition hover:bg-rose-500 sm:px-6 sm:py-3'
          >
            Book This Show
            <ArrowRight className='h-5 w-5' />
          </button>

          {activeShow.isWednesday && (
            <span className='rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300'>
              Wednesday 30% off
            </span>
          )}
        </div>
      </div>

      {uniqueShows.length > 1 && (
        <div className='relative z-10 mt-8 flex items-center gap-3'>
          <button
            type='button'
            onClick={() => setActiveIndex((prev) => (prev - 1 + uniqueShows.length) % uniqueShows.length)}
            className='rounded-full border border-white/10 bg-white/5 p-3 transition hover:bg-white/10'
          >
            <ArrowLeft className='h-4 w-4' />
          </button>

          <div className='flex items-center gap-2'>
            {uniqueShows.map((show, index) => (
              <button
                key={show._id}
                type='button'
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition ${index === safeActiveIndex ? 'w-10 bg-primary' : 'w-2.5 bg-white/35'}`}
                aria-label={`Go to ${show.movie.title}`}
              />
            ))}
          </div>

          <button
            type='button'
            onClick={() => setActiveIndex((prev) => (prev + 1) % uniqueShows.length)}
            className='rounded-full border border-white/10 bg-white/5 p-3 transition hover:bg-white/10'
          >
            <ArrowRight className='h-4 w-4' />
          </button>
        </div>
      )}
    </div>
  )
}

export default HeroSection
