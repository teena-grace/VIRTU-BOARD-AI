// lib/useAuth.ts
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  role: 'STUDENT' | 'TEACHER' | 'ADMIN'
}

export function useAuth(requiredRole?: 'STUDENT' | 'TEACHER' | 'ADMIN') {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')

    if (!token || !userStr) {
      router.push('/login')
      setLoading(false)
      return
    }

    try {
      const userData = JSON.parse(userStr)
      setUser(userData)

      if (requiredRole && userData.role !== requiredRole) {
        router.push('/dashboard')
      }
    } catch {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }, [router, requiredRole])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  return { user, loading, logout }
}