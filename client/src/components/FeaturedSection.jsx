import { ArrowRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlurCircle from "./BlurCircle";
import MovieCard from "./MovieCard";
import { service } from "../services";

const FeaturedSection = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const loadMovies = async () => {
      const data = await service.getMovies();
      setMovies(data.slice(0, 4));
    };

    loadMovies();
  }, []);

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44'>
      <div className="relative flex items-center justify-between pt-20 pb-10">
        <p className="text-gray-300 font-medium text-lg">
          Now Showing
        </p>

        <div className="relative">
          <BlurCircle top="50%" left="50%" />
          <button
            onClick={() => navigate('/movies')}
            className="group relative z-10 flex items-center gap-2 text-sm text-gray-300 cursor-pointer"
          >
            View All
            <ArrowRight className="group-hover:translate-x-0.5 transition w-4.5 h-4.5" />
          </button>
        </div>

      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {movies.map((show)=>(
            <MovieCard key={show._id} movie={show} />
        ))}
      </div>

      <div className="flex justify-center mt-20">

        <button 
        onClick={()=>{navigate('/movies'); scrollTo(0,0)}}
        className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer">
            Show more
        </button>

      </div>

    </div>
  );
};

export default FeaturedSection;
