import { dummyShowsData } from '../assets/assets'
import { getImageFromIndexedDb, isIndexedDbImageRef, saveImageToIndexedDb } from './imageStorage'

const STORAGE_KEYS = {
  users: 'quickshow_mock_users',
  movies: 'quickshow_mock_movies',
  shows: 'quickshow_mock_shows',
  bookings: 'quickshow_mock_bookings',
}

const DEFAULT_USERS = [
  {
    id: 'customer-1',
    name: 'Demo Customer',
    email: 'customer@test.com',
    password: 'password',
    role: 'customer',
  },
  {
    id: 'admin-1',
    name: 'Demo Admin',
    email: 'admin@test.com',
    password: 'password',
    role: 'admin',
  },
]

const DEFAULT_DATES = ['2025-07-23', '2025-07-24', '2025-07-25', '2025-07-26', '2025-07-27']
const DEFAULT_TIMES = ['01:00:00.000Z', '03:00:00.000Z', '05:00:00.000Z']

const buildShowId = (movieId, date, timeIndex) => `show-${movieId}-${date}-${timeIndex}`

const buildDefaultShows = () => {
  return dummyShowsData.flatMap((movie, movieIndex) =>
    DEFAULT_DATES.flatMap((date, dateIndex) =>
      DEFAULT_TIMES.slice(0, 2 + (movieIndex % 2)).map((time, timeIndex) => {
        const showDateTime = `${date}T${time}`
        const occupiedSeats = {}

        if (movieIndex === 0 && dateIndex === 0 && timeIndex === 0) {
          occupiedSeats.A1 = 'customer-1'
          occupiedSeats.A2 = 'customer-1'
        }

        if (movieIndex === 1 && dateIndex === 1 && timeIndex === 1) {
          occupiedSeats.B1 = 'customer-1'
        }

        return {
          _id: buildShowId(movie._id, date, timeIndex),
          movieId: movie._id,
          showDateTime,
          showPrice: 45 + movieIndex * 6 + timeIndex * 8,
          occupiedSeats,
        }
      }),
    ),
  )
}

const DEFAULT_SHOWS = buildDefaultShows()
const normalizeMovieRecord = (movie) => ({
  _id: movie._id,
  id: movie.id || movie._id,
  title: movie.title,
  overview: movie.overview,
  poster_path: movie.poster_path,
  backdrop_path: movie.backdrop_path || movie.poster_path,
  runtime: Number(movie.runtime || 120),
  genres: Array.isArray(movie.genres)
    ? movie.genres.map((genre, index) => (
      typeof genre === 'string'
        ? { id: index + 1, name: genre }
        : { id: genre.id || index + 1, name: genre.name }
    ))
    : [{ id: 1, name: 'Drama' }],
  language: movie.language || movie.original_language || 'en',
  tagline: movie.tagline || '',
})

const DEFAULT_MOVIES = structuredClone(dummyShowsData.map(normalizeMovieRecord))

const isWednesdayShow = (showDateTime) => new Date(showDateTime).getUTCDay() === 3
const getDiscountedPrice = (showPrice, showDateTime) => (
  isWednesdayShow(showDateTime) ? Number((showPrice * 0.7).toFixed(2)) : Number(showPrice)
)
const getBookingAmount = (show, seatCount) => Number((getDiscountedPrice(show.showPrice, show.showDateTime) * seatCount).toFixed(2))

const DEFAULT_BOOKINGS = [
  {
    _id: 'booking-1',
    userId: 'customer-1',
    showId: DEFAULT_SHOWS[0]._id,
    amount: getBookingAmount(DEFAULT_SHOWS[0], 2),
    bookedSeats: ['A1', 'A2'],
    isPaid: false,
    paymentMethod: null,
    paymentStatus: 'unpaid',
    createdAt: '2025-07-20T08:00:00.000Z',
  },
  {
    _id: 'booking-2',
    userId: 'customer-1',
    showId: DEFAULT_SHOWS[5]._id,
    amount: getBookingAmount(DEFAULT_SHOWS[5], 1),
    bookedSeats: ['B1'],
    isPaid: true,
    paymentMethod: 'online',
    paymentStatus: 'paid',
    createdAt: '2025-07-21T11:00:00.000Z',
  },
]

const delay = (value) => Promise.resolve(value)

const readStorage = (key, fallback) => {
  const raw = localStorage.getItem(key)
  if (!raw) return structuredClone(fallback)

  try {
    return JSON.parse(raw)
  } catch {
    return structuredClone(fallback)
  }
}

const writeStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const ensureWednesdayShow = (shows) => {
  const hasWednesdayShows = shows.some((show) => show.showDateTime.startsWith('2025-07-23'))
  if (hasWednesdayShows) {
    return shows
  }

  return [
    {
      _id: buildShowId(dummyShowsData[0]._id, '2025-07-23', 0),
      movieId: dummyShowsData[0]._id,
      showDateTime: '2025-07-23T03:00:00.000Z',
      showPrice: 45,
      occupiedSeats: {},
    },
    ...shows,
  ]
}

const enforceSingleShowPerDay = (shows) => {
  const seenDates = new Set()

  return shows
    .slice()
    .sort((a, b) => new Date(a.showDateTime) - new Date(b.showDateTime))
    .filter((show) => {
      const showDate = show.showDateTime.slice(0, 10)
      if (seenDates.has(showDate)) {
        return false
      }

      seenDates.add(showDate)
      return true
    })
}

const normalizeShows = (shows) => enforceSingleShowPerDay(ensureWednesdayShow(shows))

const normalizeBookings = (bookings, shows) => bookings.map((booking) => {
  const show = shows.find((item) => item._id === booking.showId)
  const amount = show ? getBookingAmount(show, booking.bookedSeats.length) : booking.amount

  const paymentMethod = booking.paymentMethod ?? (booking.isPaid ? 'online' : null)
  const paymentStatus = booking.paymentStatus ?? (booking.isPaid ? 'paid' : 'unpaid')

  return {
    contactPhone: null,
    deliveryAddress: null,
    paidAt: null,
    updatedAt: booking.createdAt,
    ...booking,
    amount,
    isPaid: booking.isPaid ?? paymentStatus === 'paid',
    paymentMethod,
    paymentStatus,
  }
})

const getStoredShows = () => normalizeShows(readStorage(STORAGE_KEYS.shows, DEFAULT_SHOWS))
const getStoredBookings = () => normalizeBookings(readStorage(STORAGE_KEYS.bookings, DEFAULT_BOOKINGS), getStoredShows())

const initializeStore = () => {
  if (!localStorage.getItem(STORAGE_KEYS.users)) {
    writeStorage(STORAGE_KEYS.users, DEFAULT_USERS)
  }

  if (!localStorage.getItem(STORAGE_KEYS.movies)) {
    writeStorage(STORAGE_KEYS.movies, DEFAULT_MOVIES)
  }

  if (!localStorage.getItem(STORAGE_KEYS.shows)) {
    writeStorage(STORAGE_KEYS.shows, DEFAULT_SHOWS)
  } else {
    writeStorage(STORAGE_KEYS.shows, getStoredShows())
  }

  if (!localStorage.getItem(STORAGE_KEYS.bookings)) {
    writeStorage(STORAGE_KEYS.bookings, DEFAULT_BOOKINGS)
  } else {
    writeStorage(STORAGE_KEYS.bookings, getStoredBookings())
  }
}

const getUsers = () => readStorage(STORAGE_KEYS.users, DEFAULT_USERS)
const getStoredMovies = () => readStorage(STORAGE_KEYS.movies, DEFAULT_MOVIES).map(normalizeMovieRecord)
const getShows = () => getStoredShows()
const getBookings = () => getStoredBookings()

const saveMovies = (movies) => writeStorage(STORAGE_KEYS.movies, movies)
const saveShows = (shows) => writeStorage(STORAGE_KEYS.shows, shows)
const saveBookings = (bookings) => writeStorage(STORAGE_KEYS.bookings, bookings)

const resolveImageField = async (value) => {
  if (!isIndexedDbImageRef(value)) {
    return value
  }

  return (await getImageFromIndexedDb(value)) || ''
}

const resolveMovieAssets = async (movie) => ({
  ...movie,
  poster_path: await resolveImageField(movie.poster_path),
  backdrop_path: await resolveImageField(movie.backdrop_path),
})

const getResolvedMovies = async () => Promise.all(getStoredMovies().map(resolveMovieAssets))

const persistMovieAssets = async (movie) => {
  const nextMovie = { ...movie }

  if (typeof nextMovie.poster_path === 'string' && nextMovie.poster_path.startsWith('data:')) {
    nextMovie.poster_path = await saveImageToIndexedDb(nextMovie.poster_path)
  }

  if (typeof nextMovie.backdrop_path === 'string' && nextMovie.backdrop_path.startsWith('data:')) {
    nextMovie.backdrop_path = await saveImageToIndexedDb(nextMovie.backdrop_path)
  }

  return nextMovie
}

const getActiveMovieIds = (shows) => [...new Set(shows.map((show) => show.movieId))]
const getActiveMovies = async () => {
  const movies = await getResolvedMovies()
  const activeMovieIds = getActiveMovieIds(getShows())
  return movies.filter((movie) => activeMovieIds.includes(movie._id))
}

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const createMovieRecord = (movieData) => {
  const movieId = `movie-${Date.now()}-${slugify(movieData.title || 'custom-show')}`
  const genres = typeof movieData.genres === 'string'
    ? movieData.genres.split(',').map((genre, index) => ({ id: index + 1, name: genre.trim() })).filter((genre) => genre.name)
    : movieData.genres

  return normalizeMovieRecord({
    _id: movieId,
    id: movieId,
    title: movieData.title,
    overview: movieData.overview,
    poster_path: movieData.poster_path,
    backdrop_path: movieData.backdrop_path || movieData.poster_path,
    genres: genres?.length ? genres : [{ id: 1, name: 'Drama' }],
    language: movieData.language || 'en',
    tagline: movieData.tagline || '',
    runtime: Number(movieData.runtime || 120),
  })
}

const enrichShow = (show, movie) => ({
  ...show,
  movie,
  isWednesday: isWednesdayShow(show.showDateTime),
  discountedPrice: getDiscountedPrice(show.showPrice, show.showDateTime),
})

const enrichBooking = (booking, movieMap) => {
  const user = getUsers().find((item) => item.id === booking.userId)
  const show = getShows().find((item) => item._id === booking.showId)
  const movie = show ? movieMap.get(show.movieId) : null

  return {
    ...booking,
    user: user ? { id: user.id, name: user.name, email: user.email, role: user.role } : null,
    show: show && movie ? enrichShow(show, movie) : null,
  }
}

const getMovieDateTimes = (movieId) => {
  return getShows()
    .filter((show) => show.movieId === movieId)
    .sort((a, b) => new Date(a.showDateTime) - new Date(b.showDateTime))
    .reduce((acc, show) => {
      const date = show.showDateTime.slice(0, 10)
      if (!acc[date]) acc[date] = []
      acc[date].push({ time: show.showDateTime, showId: show._id })
      return acc
    }, {})
}

const createShowEntries = (movieId, showPrice, dateTimeSelection) => {
  return Object.entries(dateTimeSelection).flatMap(([date, times]) =>
    times.map((time, index) => ({
      _id: `show-${movieId}-${date}-${time.replace(/:/g, '-')}-${Date.now()}-${index}`,
      movieId,
      showDateTime: `${date}T${time}`,
      showPrice: Number(showPrice),
      occupiedSeats: {},
    })),
  )
}

const hasShowOnDate = (shows, showDate, excludeShowId = null) => (
  shows.some((show) => show._id !== excludeShowId && show.showDateTime.slice(0, 10) === showDate)
)

export const mockService = {
  initialize() {
    initializeStore()
  },

  async login(email, password) {
    initializeStore()
    const user = getUsers().find((item) => item.email === email && item.password === password)

    if (!user) {
      throw new Error('Invalid email or password')
    }

    return delay({ ...user, password: undefined })
  },

  async getMovies() {
    initializeStore()
    return delay(structuredClone(await getActiveMovies()))
  },

  async getMovieCatalog() {
    initializeStore()
    return delay(structuredClone(await getResolvedMovies()))
  },

  async getMovieById(movieId) {
    initializeStore()
    const movie = (await getResolvedMovies()).find((item) => item._id === movieId)

    if (!movie) {
      throw new Error('Movie not found')
    }

    return delay(structuredClone(movie))
  },

  async getMovieDetails(movieId) {
    initializeStore()
    const movie = (await getResolvedMovies()).find((item) => item._id === movieId)

    if (!movie) {
      throw new Error('Movie not found')
    }

    return delay({
      movie: structuredClone(movie),
      dateTime: getMovieDateTimes(movieId),
    })
  },

  async getShows() {
    initializeStore()
    const movies = await getResolvedMovies()
    const movieMap = new Map(movies.map((movie) => [movie._id, movie]))
    const shows = getShows()
      .map((show) => enrichShow(show, movieMap.get(show.movieId)))
      .filter((show) => show.movie)
      .sort((a, b) => new Date(a.showDateTime) - new Date(b.showDateTime))

    return delay(structuredClone(shows))
  },

  async getShowById(showId) {
    initializeStore()
    const show = getShows().find((item) => item._id === showId)

    if (!show) {
      throw new Error('Show not found')
    }

    const movie = (await getResolvedMovies()).find((item) => item._id === show.movieId)
    return delay(structuredClone(enrichShow(show, movie)))
  },

  async getMovieSchedule(movieId) {
    initializeStore()
    return delay(structuredClone(getMovieDateTimes(movieId)))
  },

  async createShow({ movieId, movieData, showPrice, dateTimeSelection }) {
    initializeStore()

    if (!showPrice || Number(showPrice) <= 0) {
      throw new Error('Please enter a valid show price')
    }

    if (!dateTimeSelection || Object.keys(dateTimeSelection).length === 0) {
      throw new Error('Please add at least one show time')
    }

    const shows = getShows()
    const movies = getStoredMovies()
    const selectedDates = Object.keys(dateTimeSelection)

    if (selectedDates.length !== 1) {
      throw new Error('Only one show can be created at a time')
    }

    const selectedDate = selectedDates[0]
    if (hasShowOnDate(shows, selectedDate)) {
      throw new Error('Only one show is allowed per day in this cinema')
    }

    let nextMovieId = movieId
    if (!nextMovieId) {
      if (!dateTimeSelection || !showPrice) {
        throw new Error('Missing show data')
      }

      if (!movieData?.title?.trim()) {
        throw new Error('Please enter the movie title')
      }

      if (!movieData?.overview?.trim()) {
        throw new Error('Please enter the movie description')
      }

      if (!movieData?.poster_path?.trim()) {
        throw new Error('Please enter the poster image URL')
      }

      const nextMovie = await persistMovieAssets(createMovieRecord(movieData))
      saveMovies([...movies, nextMovie])
      nextMovieId = nextMovie._id
    } else if (!movies.find((movie) => movie._id === nextMovieId)) {
      throw new Error('Please choose a valid movie')
    }

    const newShows = createShowEntries(nextMovieId, showPrice, dateTimeSelection)
    saveShows([...shows, ...newShows])

    const createdMovie = (await getResolvedMovies()).find((movie) => movie._id === nextMovieId)
    return delay(structuredClone(newShows.map((show) => enrichShow(show, createdMovie))))
  },

  async updateShow(showId, payload) {
    initializeStore()
    const shows = getShows()
    const showIndex = shows.findIndex((show) => show._id === showId)

    if (showIndex === -1) {
      throw new Error('Show not found')
    }

    const currentShow = shows[showIndex]
    const nextDateTime = payload.showDateTime ?? currentShow.showDateTime
    const nextPrice = payload.showPrice ?? currentShow.showPrice
    const nextDate = nextDateTime.slice(0, 10)

    if (hasShowOnDate(shows, nextDate, showId)) {
      throw new Error('Another show already exists on that date')
    }

    shows[showIndex] = {
      ...currentShow,
      showDateTime: nextDateTime,
      showPrice: Number(nextPrice),
    }

    saveShows(shows)

    return delay(structuredClone(enrichShow(shows[showIndex])))
  },

  async deleteShow(showId) {
    initializeStore()
    const shows = getShows()
    const bookings = getBookings()
    const nextShows = shows.filter((show) => show._id !== showId)

    if (nextShows.length === shows.length) {
      throw new Error('Show not found')
    }

    const nextBookings = bookings.filter((booking) => booking.showId !== showId)

    saveShows(nextShows)
    saveBookings(nextBookings)

    return delay(true)
  },

  async getBookings() {
    initializeStore()
    const movies = await getResolvedMovies()
    const movieMap = new Map(movies.map((movie) => [movie._id, movie]))
    const bookings = getBookings()
      .map((booking) => enrichBooking(booking, movieMap))
      .filter((booking) => booking.show && booking.user)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return delay(structuredClone(bookings))
  },

  async getMyBookings(userId) {
    initializeStore()
    const movies = await getResolvedMovies()
    const movieMap = new Map(movies.map((movie) => [movie._id, movie]))
    const bookings = getBookings()
      .filter((booking) => booking.userId === userId)
      .map((booking) => enrichBooking(booking, movieMap))
      .filter((booking) => booking.show)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return delay(structuredClone(bookings))
  },

  async bookSeats({ showId, seats, userId }) {
    initializeStore()

    if (!userId) {
      throw new Error('You need to login before booking')
    }

    if (!showId) {
      throw new Error('Please choose a show time')
    }

    if (!seats || seats.length === 0) {
      throw new Error('Please choose at least one seat')
    }

    const shows = getShows()
    const bookings = getBookings()
    const showIndex = shows.findIndex((item) => item._id === showId)

    if (showIndex === -1) {
      throw new Error('Show not found')
    }

    const show = shows[showIndex]
    const unavailableSeats = seats.filter((seat) => show.occupiedSeats[seat])

    if (unavailableSeats.length > 0) {
      throw new Error(`Seats already booked: ${unavailableSeats.join(', ')}`)
    }

    const nextShow = {
      ...show,
      occupiedSeats: {
        ...show.occupiedSeats,
      },
    }

    seats.forEach((seat) => {
      nextShow.occupiedSeats[seat] = userId
    })

    shows[showIndex] = nextShow

    const booking = {
      _id: `booking-${Date.now()}`,
      userId,
      showId,
      amount: getBookingAmount(show, seats.length),
      bookedSeats: [...seats],
      isPaid: false,
      paymentMethod: null,
      paymentStatus: 'unpaid',
      createdAt: new Date().toISOString(),
    }

    bookings.push(booking)
    saveShows(shows)
    saveBookings(bookings)

    const movies = await getResolvedMovies()
    const movieMap = new Map(movies.map((movie) => [movie._id, movie]))
    return delay(structuredClone(enrichBooking(booking, movieMap)))
  },

  async markBookingPaid(bookingId, userId) {
    initializeStore()
    const bookings = getBookings()
    const bookingIndex = bookings.findIndex((item) => item._id === bookingId && item.userId === userId)

    if (bookingIndex === -1) {
      throw new Error('Booking not found')
    }

    bookings[bookingIndex] = {
      ...bookings[bookingIndex],
      isPaid: true,
    }

    saveBookings(bookings)

    const movies = await getResolvedMovies()
    const movieMap = new Map(movies.map((movie) => [movie._id, movie]))
    return delay(structuredClone(enrichBooking(bookings[bookingIndex], movieMap)))
  },

  async submitPayment({ bookingId, userId, method, phone, address }) {
    initializeStore()
    const bookings = getBookings()
    const bookingIndex = bookings.findIndex((item) => item._id === bookingId && item.userId === userId)

    if (bookingIndex === -1) {
      throw new Error('Booking not found')
    }

    if (method !== 'online' && method !== 'direct') {
      throw new Error('Invalid payment method')
    }

    if (method === 'direct') {
      if (!phone?.trim()) {
        throw new Error('Phone number is required')
      }

      if (!address?.trim()) {
        throw new Error('Address is required')
      }
    }

    bookings[bookingIndex] = {
      ...bookings[bookingIndex],
      isPaid: method === 'online',
      paymentMethod: method,
      paymentStatus: method === 'online' ? 'paid' : 'awaiting-direct-payment',
      contactPhone: method === 'direct' ? phone.trim() : null,
      deliveryAddress: method === 'direct' ? address.trim() : null,
      paidAt: method === 'online' ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
    }

    saveBookings(bookings)

    const movies = await getResolvedMovies()
    const movieMap = new Map(movies.map((movie) => [movie._id, movie]))
    return delay(structuredClone(enrichBooking(bookings[bookingIndex], movieMap)))
  },

  async confirmDirectPayment(bookingId) {
    initializeStore()
    const bookings = getBookings()
    const bookingIndex = bookings.findIndex((item) => item._id === bookingId)

    if (bookingIndex === -1) {
      throw new Error('Booking not found')
    }

    if (bookings[bookingIndex].paymentMethod !== 'direct') {
      throw new Error('Only direct payments can be confirmed here')
    }

    bookings[bookingIndex] = {
      ...bookings[bookingIndex],
      isPaid: true,
      paymentStatus: 'paid',
      paidAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    saveBookings(bookings)

    const movies = await getResolvedMovies()
    const movieMap = new Map(movies.map((movie) => [movie._id, movie]))
    return delay(structuredClone(enrichBooking(bookings[bookingIndex], movieMap)))
  },

  async cancelBooking(bookingId) {
    initializeStore()
    const bookings = getBookings()
    const shows = getShows()
    const bookingIndex = bookings.findIndex((item) => item._id === bookingId)

    if (bookingIndex === -1) {
      throw new Error('Booking not found')
    }

    const booking = bookings[bookingIndex]
    const showIndex = shows.findIndex((item) => item._id === booking.showId)

    if (showIndex !== -1) {
      const show = shows[showIndex]
      booking.bookedSeats.forEach((seat) => {
        delete show.occupiedSeats[seat]
      })
      shows[showIndex] = { ...show }
      saveShows(shows)
    }

    const nextBookings = bookings.filter((item) => item._id !== bookingId)
    saveBookings(nextBookings)

    return delay(true)
  },

  async getDashboardStats() {
    initializeStore()
    const users = getUsers()
    const shows = getShows()
    const bookings = getBookings()
    const movies = await getResolvedMovies()
    const movieMap = new Map(movies.map((movie) => [movie._id, movie]))
    const paidBookings = bookings.filter((booking) => booking.paymentStatus === 'paid')
    const pendingDirectBookings = bookings.filter((booking) => booking.paymentStatus === 'awaiting-direct-payment')

    return delay({
      totalBookings: bookings.length,
      totalRevenue: paidBookings.reduce((sum, booking) => sum + booking.amount, 0),
      pendingDirectRevenue: pendingDirectBookings.reduce((sum, booking) => sum + booking.amount, 0),
      onlinePayments: paidBookings.filter((booking) => booking.paymentMethod === 'online').length,
      directPayments: pendingDirectBookings.length,
      totalUser: users.length,
      activeShows: shows
        .slice()
        .sort((a, b) => new Date(a.showDateTime) - new Date(b.showDateTime))
        .slice(0, 6)
        .map((show) => enrichShow(show, movieMap.get(show.movieId)))
        .filter((show) => show.movie),
    })
  },

  async getMyTickets(userId) {
    initializeStore()
    const movies = await getResolvedMovies()
    const movieMap = new Map(movies.map((movie) => [movie._id, movie]))
    const bookings = getBookings()
      .filter((booking) => booking.userId === userId && booking.paymentStatus === 'paid')
      .map((booking) => enrichBooking(booking, movieMap))
      .filter((booking) => booking.show)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return delay(structuredClone(bookings))
  },
}
