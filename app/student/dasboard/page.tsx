// app/teacher/dashboard/page.tsx
'use client'

import { useAuth } from '@/lib/useAuth'
import { useState } from 'react'

export default function TeacherDashboard() {
  const { user, loading, logout } = useAuth('TEACHER')
  const [activeTab, setActiveTab] = useState('overview')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">👨‍🏫 Teacher Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b">
          {['overview', 'students', 'classes', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize ${
                activeTab === tab
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Students</p>
                  <h3 className="text-3xl font-bold text-gray-800 mt-2">156</h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <i className="fas fa-users text-blue-600 text-2xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Active Classes</p>
                  <h3 className="text-3xl font-bold text-gray-800 mt-2">8</h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <i className="fas fa-chalkboard text-green-600 text-2xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Avg. Attendance</p>
                  <h3 className="text-3xl font-bold text-gray-800 mt-2">92%</h3>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <i className="fas fa-chart-line text-purple-600 text-2xl"></i>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Student List</h2>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold">S{i}</span>
                    </div>
                    <div>
                      <p className="font-medium">Student Name {i}</p>
                      <p className="text-sm text-gray-600">student{i}@example.com</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg">
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Classes Tab */}
        {activeTab === 'classes' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">My Classes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Data Structures', 'Algorithms', 'Web Development', 'AI & ML'].map((cls) => (
                <div key={cls} className="border rounded-lg p-4 hover:shadow-md transition">
                  <h3 className="font-bold text-lg">{cls}</h3>
                  <p className="text-sm text-gray-600 mt-1">45 students enrolled</p>
                  <div className="mt-4 flex space-x-2">
                    <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                      View Details
                    </button>
                    <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Performance Analytics</h2>
            <div className="text-center py-12 text-gray-500">
              <i className="fas fa-chart-bar text-6xl mb-4"></i>
              <p>Analytics coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}