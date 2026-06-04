import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import Movie from './pages/Movie'
import MovieDetail from './pages/MovieDetail'
import SeatLayout from './pages/SeatLayout'
import MyBooking from './pages/MyBooking'
import Layout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import AddShows from './pages/admin/AddShows'
import ListShows from './pages/admin/ListShow'
import ListBookings from './pages/admin/ListBookings'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith('/admin')

  return (
    <>
      <Toaster />
      {!isAdminRoute && <NavBar />}
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/movies' element={<Movie/>} />
        <Route path='/movies/:id' element={<MovieDetail/>} />
        <Route
          path='/movies/:id/:date'
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <SeatLayout/>
            </ProtectedRoute>
          }
        />
        <Route
          path='/my-bookings'
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <MyBooking/>
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/*'
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout/>
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard/>}/>
          <Route path='add-shows' element={<AddShows/>}/>
          <Route path='list-shows' element={<ListShows/>}/>
          <Route path='list-bookings' element={<ListBookings/>}/>
        </Route>
      </Routes>
      {!isAdminRoute && <Footer/>}
    </>
  )
}

export default App
