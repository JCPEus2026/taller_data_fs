import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('tasacasa_user')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })

  const login = (userData) => {
    localStorage.setItem('tasacasa_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('tasacasa_user')
    setUser(null)
  }

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('tasacasa_users') || '[]')
    const exists = users.find(u => u.email === userData.email)
    if (exists) throw new Error('El email ya está registrado')
    const newUser = { ...userData, id: Date.now(), createdAt: new Date().toISOString() }
    users.push(newUser)
    localStorage.setItem('tasacasa_users', JSON.stringify(users))
    login(newUser)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
