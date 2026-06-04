import React, { useEffect, useMemo, useState } from "react";
import { CalendarDaysIcon, FilmIcon, ImageIcon, PlusIcon, StarIcon, TicketIcon, UploadIcon } from "lucide-react";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { service } from "../../services";

const emptyMovieForm = {
    title: "",
    overview: "",
    poster_path: "",
    backdrop_path: "",
    runtime: "120",
    genres: "Drama",
    language: "en",
    tagline: "",
};

const AddShows = () => {
    const currency = import.meta.env.VITE_CURRENCY;
    const [catalogMovies, setCatalogMovies] = useState([]);
    const [existingShows, setExistingShows] = useState([]);
    const [mode, setMode] = useState("existing");
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [showDateTime, setShowDateTime] = useState("");
    const [showprice, setshowprice] = useState("");
    const [movieForm, setMovieForm] = useState(emptyMovieForm);
    const [loading, setLoading] = useState(true);

    const handleImageUpload = (field) => (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setMovieForm((prev) => ({
                ...prev,
                [field]: reader.result,
            }));
        };
        reader.readAsDataURL(file);
    };

    const loadData = async () => {
        const [movies, shows] = await Promise.all([service.getMovieCatalog(), service.getShows()]);
        setCatalogMovies(movies);
        setExistingShows(shows);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const selectedMovieData = useMemo(
        () => catalogMovies.find((movie) => movie._id === selectedMovie),
        [catalogMovies, selectedMovie],
    );

    const previewMovie = mode === "existing" ? selectedMovieData : {
        ...movieForm,
        genres: movieForm.genres.split(",").map((name, index) => ({ id: index + 1, name: name.trim() })).filter((genre) => genre.name),
    };

    const selectedDate = showDateTime ? showDateTime.split("T")[0] : "";
    const conflictingShow = existingShows.find((show) => show.showDateTime.slice(0, 10) === selectedDate);

    const handleAddShow = async () => {
        try {
            if (!showDateTime) {
                throw new Error("Please select the show date and time");
            }

            if (new Date(showDateTime) < new Date()) {
                throw new Error("Cannot create a show in the past");
            }

            const [date, time] = showDateTime.split("T");
            await service.createShow({
                movieId: mode === "existing" ? selectedMovie : null,
                movieData: mode === "custom" ? movieForm : null,
                showPrice: showprice,
                dateTimeSelection: { [date]: [time] },
            });

            toast.success("New show created");
            setSelectedMovie(null);
            setShowDateTime("");
            setshowprice("");
            setMovieForm(emptyMovieForm);
            await loadData();
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <Title text1='Add' text2='Shows' />
            <div className="grid gap-8 xl:grid-cols-[1.2fr,0.8fr]">
                <div className="rounded-3xl border border-primary/20 bg-primary/8 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold">Event Management Form</h2>
                            <p className="mt-1 text-sm text-gray-400">
                                One cinema, so only one show can exist on each calendar day.
                            </p>
                        </div>
                        <div className="rounded-full bg-primary/15 px-4 py-2 text-xs uppercase tracking-[0.2em] text-primary">
                            Admin
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                        <button
                            type="button"
                            onClick={() => setMode("existing")}
                            className={`rounded-full px-4 py-2 text-sm transition ${mode === "existing" ? "bg-primary text-white" : "border border-white/10 text-gray-300"}`}
                        >
                            Use Existing Movie
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode("custom")}
                            className={`rounded-full px-4 py-2 text-sm transition ${mode === "custom" ? "bg-primary text-white" : "border border-white/10 text-gray-300"}`}
                        >
                            Create Custom Movie
                        </button>
                    </div>

                    {mode === "existing" ? (
                        <div className="mt-6">
                            <label className="mb-3 block text-sm font-medium">Select Movie</label>
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {catalogMovies.map((movie) => (
                                    <button
                                        key={movie._id}
                                        type="button"
                                        onClick={() => setSelectedMovie(movie._id)}
                                        className={`overflow-hidden rounded-2xl border p-3 text-left transition ${
                                            selectedMovie === movie._id
                                                ? 'border-primary bg-primary/12'
                                                : 'border-white/10 bg-white/5 hover:bg-white/10'
                                        }`}
                                    >
                                        <img src={movie.poster_path} alt="" className="h-48 w-full rounded-xl object-cover" />
                                        <p className="mt-3 truncate font-medium">{movie.title}</p>
                                        <p className="mt-1 text-sm text-gray-400">{movie.genres.slice(0, 2).map((genre) => genre.name).join(" | ")}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="mt-6 space-y-5">
                            <div className="grid gap-5 md:grid-cols-1">
                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium">Movie Title</span>
                                    <input
                                        value={movieForm.title}
                                        onChange={(event) => setMovieForm((prev) => ({ ...prev, title: event.target.value }))}
                                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
                                    />
                                </label>
                            </div>

                            <label className="block">
                                <span className="mb-2 block text-sm font-medium">Description</span>
                                <textarea
                                    rows={4}
                                    value={movieForm.overview}
                                    onChange={(event) => setMovieForm((prev) => ({ ...prev, overview: event.target.value }))}
                                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
                                />
                            </label>

                            <div className="grid gap-5 md:grid-cols-2">
                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium">Poster Image</span>
                                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10">
                                            <UploadIcon className="h-4 w-4" />
                                            Upload Poster
                                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload('poster_path')} />
                                        </label>
                                        <input
                                            value={movieForm.poster_path}
                                            onChange={(event) => setMovieForm((prev) => ({ ...prev, poster_path: event.target.value }))}
                                            placeholder="Or paste image URL"
                                            className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
                                        />
                                        {movieForm.poster_path && (
                                            <img src={movieForm.poster_path} alt="" className="mt-3 h-40 w-full rounded-2xl object-cover" />
                                        )}
                                    </div>
                                </label>
                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium">Backdrop Image</span>
                                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10">
                                            <UploadIcon className="h-4 w-4" />
                                            Upload Backdrop
                                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload('backdrop_path')} />
                                        </label>
                                        <input
                                            value={movieForm.backdrop_path}
                                            onChange={(event) => setMovieForm((prev) => ({ ...prev, backdrop_path: event.target.value }))}
                                            placeholder="Or paste image URL"
                                            className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
                                        />
                                        {movieForm.backdrop_path && (
                                            <img src={movieForm.backdrop_path} alt="" className="mt-3 h-40 w-full rounded-2xl object-cover" />
                                        )}
                                    </div>
                                </label>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium">Runtime</span>
                                    <input
                                        type="number"
                                        value={movieForm.runtime}
                                        onChange={(event) => setMovieForm((prev) => ({ ...prev, runtime: event.target.value }))}
                                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
                                    />
                                </label>
                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium">Genres</span>
                                    <input
                                        value={movieForm.genres}
                                        onChange={(event) => setMovieForm((prev) => ({ ...prev, genres: event.target.value }))}
                                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
                                    />
                                </label>
                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium">Language</span>
                                    <input
                                        value={movieForm.language}
                                        onChange={(event) => setMovieForm((prev) => ({ ...prev, language: event.target.value }))}
                                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
                                    />
                                </label>
                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium">Tagline</span>
                                    <input
                                        value={movieForm.tagline}
                                        onChange={(event) => setMovieForm((prev) => ({ ...prev, tagline: event.target.value }))}
                                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
                                    />
                                </label>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 grid gap-5 md:grid-cols-2">
                        <label className="block">
                            <span className="mb-2 block text-sm font-medium">Date & Time</span>
                            <input
                                type="datetime-local"
                                value={showDateTime}
                                min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                                onChange={(event) => setShowDateTime(event.target.value)}
                                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
                            />
                        </label>
                        <label className="block">
                            <span className="mb-2 block text-sm font-medium">Ticket Price</span>
                            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                <span className="text-sm text-gray-400">{currency}</span>
                                <input
                                    type="number"
                                    min="0"
                                    value={showprice}
                                    onChange={(event) => setshowprice(event.target.value)}
                                    className="w-full bg-transparent outline-none"
                                />
                            </div>
                        </label>
                    </div>

                    {conflictingShow && (
                        <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200">
                            This date already has a show scheduled: <span className="font-medium">{conflictingShow.movie.title}</span>.
                        </div>
                    )}

                    <div className="mt-6 flex gap-3">
                        <button
                            type="button"
                            onClick={handleAddShow}
                            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition hover:bg-primary-dull"
                        >
                            <PlusIcon className="h-4 w-4" />
                            Create Show
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-3xl border border-primary/20 bg-primary/8 p-6">
                        <p className="text-sm uppercase tracking-[0.2em] text-primary">Preview</p>
                        {previewMovie?.title ? (
                            <div className="mt-4">
                                <img
                                    src={previewMovie.poster_path || previewMovie.backdrop_path}
                                    alt=""
                                    className="h-72 w-full rounded-2xl object-cover"
                                />
                                <div className="mt-4">
                                    <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-gray-400">
                                        <FilmIcon className="w-4 h-4 text-primary" />
                                        Show Preview
                                    </div>
                                    <p className="mt-2 text-2xl font-semibold">{previewMovie.title}</p>
                                    <p className="mt-2 text-sm text-gray-400">{previewMovie.overview}</p>
                                    <div className="mt-5 grid gap-3 text-sm text-gray-300">
                                        <p className="flex items-center gap-2">
                                            <CalendarDaysIcon className="w-4 h-4 text-primary" />
                                            {showDateTime ? new Date(showDateTime).toLocaleString() : 'No schedule selected'}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <TicketIcon className="w-4 h-4 text-primary" />
                                            Base price: {showprice ? `${currency} ${showprice}` : 'Not set'}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <ImageIcon className="w-4 h-4 text-primary" />
                                            Language: {previewMovie.language || 'Unknown'}
                                        </p>
                                    </div>
                                    <p className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                                        Wednesday shows are discounted automatically by 30%.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="mt-4 text-sm text-gray-400">
                                Fill the form to preview the show before creation.
                            </p>
                        )}
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                        <h3 className="text-lg font-medium">Scheduled Days</h3>
                        <div className="mt-4 space-y-3">
                            {existingShows
                                .slice()
                                .sort((a, b) => new Date(a.showDateTime) - new Date(b.showDateTime))
                                .map((show) => (
                                    <div key={show._id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                        <p className="font-medium">{show.movie.title}</p>
                                        <p className="mt-1 text-sm text-gray-400">{new Date(show.showDateTime).toLocaleString()}</p>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddShows;
