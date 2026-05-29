import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Heart, PlayCircleIcon } from 'lucide-react'
import timeFormat from '../lib/timeFormat.js'
import DateSelect from '../components/DateSelect'
import MovieCard from '../components/MovieCard'
import Loading from '../components/Loading'
import { service } from '../services'

const MovieDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [show, setShow] = useState(null)
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    const loadMovieDetails = async () => {
      const [movieDetails, movies] = await Promise.all([
        service.getMovieDetails(id),
        service.getMovies(),
      ])

      setShow(movieDetails)
      setRecommendations(movies.filter((movie) => movie._id !== id).slice(0, 4))
    }

    loadMovieDetails()
  }, [id])

  return show ? (
    <div className='px-6 pt-30 md:px-16 md:pt-50 lg:px-40'>
      <div className='mx-auto flex max-w-6xl flex-col gap-8 md:flex-row'>
        <img
          src={show.movie.poster_path}
          alt=''
          className='h-104 max-w-70 object-cover max-md:mx-auto rounded-xl'
        />

        <div className='relative flex flex-col gap-3'>
          <p className='text-primary'>{show.movie.language}</p>
          <h1 className='max-w-96 text-4xl font-semibold text-balance'>
            {show.movie.title}
          </h1>
          <p className='text-gray-400 mt-2 text-sm leading-tight max-w-xl'>
            {show.movie.overview}</p>
          <p>
            {timeFormat(show.movie.runtime)} . {show.movie.genres.map(genre=>genre.name).join(", ")} . 
            {show.movie.language}
          </p>
          <div className='flex items-center flex-wrap gap-4 mt-4'>
            <button 
            className='flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md 
            font-medium cursor-pointer active:scale-95'>
              <PlayCircleIcon className='w-5 h-5' />
              Watch Trailer
            </button>
            <a href="#dateSelect"
            className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium 
            cursor-pointer active:scale-95'>
              Buy Tickets
            </a>
            <button className='bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95'>
              <Heart className={`w-5 h-5`} />
            </button>
          </div>
        </div>
      </div>
      <DateSelect dateTime={show.dateTime} id={id}/>

      <p className='mt-20 mb-8 text-lg font-medium'>
        You may also like
      </p>

      <div className='mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {recommendations.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
      <div className='flex justify-center mt-20'>
        <button onClick={()=> {navigate('/movies'); scrollTo(0,0)}} 
        className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer'>
          Show more
        </button>
      </div>
    </div>
  ) : (
    <div>
      <Loading />
    </div>
  )
}

export default MovieDetail
