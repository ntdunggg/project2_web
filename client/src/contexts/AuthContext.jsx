import { useState } from 'react'
import { service } from '../services'
import { AuthContext } from './auth-context'
const CURRENT_USER_KEY = 'quickshow_current_user'

const getStoredUser = () => {
  service.initialize()
  const rawUser = localStorage.getItem(CURRENT_USER_KEY)

  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser)
  } catch {
    localStorage.removeItem(CURRENT_USER_KEY)
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser)

  const login = async (email, password) => {
    const nextUser = await service.login(email, password)
    setUser(nextUser)
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(nextUser))
    return nextUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(CURRENT_USER_KEY)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: false,
        login,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
