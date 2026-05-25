import React, { useEffect, useState } from 'react'
import MovieCard from '../components/MovieCard'
import Loading from '../components/Loading'
import { service } from '../services'

const Fav = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMovies = async () => {
      const data = await service.getMovies()
      setMovies(data)
      setLoading(false)
    }

    loadMovies()
  }, [])

  if (loading) {
    return <Loading />
  }

  return movies.length > 0 ? (
    <div className='relative my-40 min-h-[80vh] overflow-hidden px-6 md:px-16 lg:px-40 xl:px-44'>
      <h1 className='my-4 text-lg font-medium'>
        My Favourites
      </h1>

      <div className='mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {movies.map((movie) => (
          <MovieCard movie={movie} key={movie._id} />
        ))}
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-3xl font-bold text-center'>
        No movies available right now.
      </h1>
    </div>
  )
}

export default Fav
