import React, { useState } from 'react'

const BACKEND_URL = 'https://traveladvisorbackend.onrender.com'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [formData, setFormData] = useState({
    city: '',
    country: '',
    start_date: '',
    end_date: ''
  })
  const [advice, setAdvice] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams(formData)
      const response = await fetch(`${BACKEND_URL}/advice?${params}`)

      if (!response.ok) throw new Error('Failed to fetch data')

      const data = await response.json()
      setAdvice(data)
      setCurrentPage('results')
    } catch (err) {
      setError('Failed to get travel advice. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Home Page
  if (currentPage === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="text-center text-white max-w-2xl">
          <h1 className="text-5xl font-bold mb-4">🌍 Travel Safety Advisor</h1>
          <p className="text-xl mb-8 opacity-90">Get instant safety advice for your next destination</p>
          <button 
            onClick={() => setCurrentPage('form')}
            className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Get Started →
          </button>
        </div>
      </div>
    )
  }

  // Form Page
  if (currentPage === 'form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Plan Your Trip</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter city"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Get Safety Advice'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Results Page - FIXED VERSION
  if (currentPage === 'results' && advice) {
    const renderSection = (title, data, colorClass) => {
      if (!data) return (
        <div className="bg-gray-100 border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
          <p className="text-gray-600">No data available</p>
        </div>
      )
      
      const renderValue = (value) => {
        if (Array.isArray(value)) {
          return value.map((item, index) => (
            <div key={index} className="ml-2">
              {typeof item === 'object' ? (
                Object.entries(item).map(([subKey, subValue]) => (
                  <div key={subKey} className="ml-4">
                    <span className="font-medium">{subKey}:</span> {subValue}
                  </div>
                ))
              ) : (
                String(item)
              )}
            </div>
          ))
        } else if (typeof value === 'object') {
          return Object.entries(value).map(([subKey, subValue]) => (
            <div key={subKey} className="ml-2">
              <span className="font-medium">{subKey}:</span> {String(subValue)}
            </div>
          ))
        } else {
          return String(value)
        }
      }

      return (
        <div className={`${colorClass} border rounded-xl p-6 transition-transform hover:scale-105`}>
          <h3 className="text-lg font-semibold mb-3">{title}</h3>
          {typeof data === 'object' ? (
            <div className="space-y-2 text-sm">
              {Object.entries(data).map(([key, value]) => (
                <div key={key}>
                  <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>
                  {renderValue(value)}
                </div>
              ))}
            </div>
          ) : (
            <p>{String(data)}</p>
          )}
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 bg-white rounded-2xl p-6 shadow-lg">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Safety Advice for {formData.city}, {formData.country}
            </h1>
            <p className="text-gray-600 text-lg">Travel dates: {formData.start_date} to {formData.end_date}</p>
            <div className="mt-4 bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-full inline-block">
              🎯 Your Personalized Travel Guide
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {renderSection('🛡️ Safety & Security', advice.safety_and_security, 'bg-red-50 border-red-200 text-red-900')}
            {renderSection('🏥 Health & Wellness', advice.health_and_wellness, 'bg-green-50 border-green-200 text-green-900')}
            {renderSection('🤝 Cultural Etiquette', advice.cultural_etiquette, 'bg-yellow-50 border-yellow-200 text-yellow-900')}
            {renderSection('🚨 Emergency Contacts', advice.emergency_contacts, 'bg-blue-50 border-blue-200 text-blue-900')}
            {renderSection('🌤️ Weather Forecast', advice.weather_forecast, 'bg-sky-50 border-sky-200 text-sky-900')}
            {renderSection('⚖️ Local Laws', advice.local_laws, 'bg-purple-50 border-purple-200 text-purple-900')}
          </div>

          <div className="text-center space-x-4">
            <button
              onClick={() => {
                setCurrentPage('form')
                setAdvice(null)
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              🔍 Search Another Destination
            </button>
            <button
              onClick={() => setCurrentPage('home')}
              className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              🏠 Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default App
