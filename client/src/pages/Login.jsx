import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/useAuth'

const demoAccounts = [
  { role: 'Customer', email: 'customer@test.com', password: 'password' },
  { role: 'Admin', email: 'admin@test.com', password: 'password' },
]

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    email: demoAccounts[0].email,
    password: demoAccounts[0].password,
  })
  const [submitting, setSubmitting] = useState(false)

  const from = location.state?.from?.pathname
  const redirectPath = from && from !== '/login' ? from : '/'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)

    try {
      const user = await login(formData.email, formData.password)
      toast.success(`Logged in as ${user.role}`)
      navigate(user.role === 'admin' && redirectPath === '/' ? '/admin' : redirectPath, { replace: true })
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6 py-24 md:px-16">

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-primary">QuickShow Mock Auth</p>
        <h1 className="mt-3 text-3xl font-semibold">Login with demo accounts</h1>
        <p className="mt-3 text-sm text-gray-400">
          Customer can book tickets. Admin can manage shows and bookings.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {demoAccounts.map((account) => (
            <button
              key={account.role}
              type="button"
              onClick={() => setFormData({ email: account.email, password: account.password })}
              className="rounded-2xl border border-primary/30 bg-primary/10 p-4 text-left transition hover:bg-primary/20"
            >
              <p className="font-medium">{account.role}</p>
              <p className="mt-2 text-sm text-gray-400">{account.email}</p>
              <p className="text-sm text-gray-500">{account.password}</p>
            </button>
          ))}
        </div>

        <label className="mt-8 block text-sm text-gray-300">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
          className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 outline-none"
          required
        />

        <label className="mt-5 block text-sm text-gray-300">Password</label>
        <input
          type="password"
          value={formData.password}
          onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
          className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 outline-none"
          required
        />

        <button
          type="submit"
          disabled={submitting}
          className="mt-8 w-full rounded-full bg-rose-400 px-6 py-3 font-medium text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default Login
