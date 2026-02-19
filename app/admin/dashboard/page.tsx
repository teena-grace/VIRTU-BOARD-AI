// app/admin/dashboard/page.tsx
'use client'

import { useAuth } from '@/lib/useAuth'
import { useState } from 'react'

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth('ADMIN')
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
            <h1 className="text-2xl font-bold text-gray-800">👨‍💼 Admin Dashboard</h1>
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
          {['overview', 'users', 'teachers', 'settings'].map((tab) => (
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
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Users</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">1,245</h3>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <i className="fas fa-users text-blue-600 text-2xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Teachers</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">45</h3>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <i className="fas fa-chalkboard-teacher text-green-600 text-2xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Students</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">1,200</h3>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <i className="fas fa-user-graduate text-purple-600 text-2xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Active Sessions</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">234</h3>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <i className="fas fa-desktop text-orange-600 text-2xl"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {[
                  { action: 'New user registered', user: 'John Doe', time: '5 mins ago' },
                  { action: 'Teacher created class', user: 'Jane Smith', time: '15 mins ago' },
                  { action: 'Student completed course', user: 'Mike Johnson', time: '1 hour ago' }
                ].map((activity, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.user}</p>
                    </div>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">All Users</h2>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <i className="fas fa-plus mr-2"></i>
                Add User
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i}>
                      <td className="px-4 py-3">User {i}</td>
                      <td className="px-4 py-3">user{i}@example.com</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          Student
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          Active
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-green-600 hover:text-green-800 mr-2">Edit</button>
                        <button className="text-red-600 hover:text-red-800">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Other tabs */}
        {activeTab === 'teachers' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Teacher Management</h2>
            <p className="text-gray-600">Teacher management features coming soon...</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">System Settings</h2>
            <p className="text-gray-600">Settings panel coming soon...</p>
          </div>
        )}
      </div>
    </div>
  )
}