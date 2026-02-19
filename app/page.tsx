// app/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        switch (user.role) {
          case 'ADMIN':
            router.push('/admin/dashboard')
            break
          case 'TEACHER':
            router.push('/teacher/dashboard')
            break
          default:
            router.push('/dashboard')
        }
      } catch {
        router.push('/login')
      }
    } else {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
  <div className="text-center">
    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    <p className="mt-4 text-gray-600">Redirecting...</p>
  </div>
</div>
  )
}