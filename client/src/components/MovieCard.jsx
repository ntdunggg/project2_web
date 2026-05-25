import React from "react";
import { useNavigate } from "react-router-dom";
import timeFormat from "../lib/timeFormat.js";

const MovieCard = ({ movie }) => {

  const navigate = useNavigate()

  return (
    <div
      className='flex w-full flex-col justify-between rounded-3xl border border-primary/20 bg-primary/8 p-3 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-primary/12'
    >
      <img
        onClick={() => {
          navigate(`/movies/${movie._id}`)
          scrollTo(0, 0)
        }}
        src={movie.backdrop_path}
        alt={movie.title}
        className='h-52 w-full cursor-pointer rounded-2xl object-cover object-right-bottom'
      />

      <p className="mt-4 truncate text-lg font-semibold">{movie.title}</p>

      <p className="mt-2 text-sm text-gray-400">
        {movie.genres.slice(0, 2).map((genre) => genre.name).join(' | ')} . {timeFormat(movie.runtime)} . {movie.language}
      </p>

      <div className="mt-5 flex items-center justify-between pb-2">
        <button
          onClick={() => {
            navigate(`/movies/${movie._id}`)
            scrollTo(0, 0)
          }}
          className='cursor-pointer rounded-full bg-primary px-4 py-2 text-xs font-medium transition hover:bg-primary-dull'
        >
          Buy Tickets
        </button>
      </div>
    </div>
  )
}

export default MovieCard
