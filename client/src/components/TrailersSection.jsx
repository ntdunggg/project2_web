import React, { useState } from "react";
import { dummyTrailers } from "../assets/assets";
import ReactPlayer from 'react-player'
import BlurCircle from "./BlurCircle";
import { PlayCircleIcon } from "lucide-react";

const TrailersSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0])

  return (
    <div className="overflow-hidden px-6 py-20 md:px-16 lg:px-24 xl:px-44">
      <p className="max-w-[960px] text-lg font-medium text-gray-300">Trailers</p>

      <div className="relative mt-6">
        <div className="relative z-10 mx-auto aspect-video w-full max-w-[960px] overflow-hidden rounded-2xl">
          <ReactPlayer
            src={currentTrailer.videoUrl}
            controls={true}
            width='100%'
            height='100%'
            className="absolute inset-0"
          />
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
        {dummyTrailers.map((trailer) => (
          <div
            key={trailer.image}
            className='relative cursor-pointer overflow-hidden rounded-lg transition duration-300 hover:-translate-y-1'
            onClick={() => setCurrentTrailer(trailer)}
          >
            <img
              src={trailer.image}
              alt="trailer"
              className="h-32 w-full object-cover brightness-75 md:h-60"
            />
            <PlayCircleIcon
              strokeWidth={1.6}
              className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 md:h-12 md:w-12"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrailersSection
