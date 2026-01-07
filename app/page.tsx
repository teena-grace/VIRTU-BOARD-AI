'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push('/dashboard')
  }, [router])

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #90ee90, #32cd32)'
    }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <i className="fas fa-chalkboard-teacher" style={{ fontSize: '80px', marginBottom: '20px' }}></i>
        <h1 style={{ fontSize: '48px', marginBottom: '10px' }}>VIRTU-BOARD AI</h1>
        <p style={{ fontSize: '20px' }}>Loading your smart board...</p>
      </div>
    </div>
  )
}
