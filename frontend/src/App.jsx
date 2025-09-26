import React, { useState, useEffect } from 'react'

const BACKEND_URL = 'https://traveladvisorbackend.onrender.com'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [formData, setFormData] = useState({
    country: '',
    state: '',
    city: '',
    start_date: '',
    end_date: ''
  })
  const [advice, setAdvice] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [stateList, setStateList] = useState([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [feedbackLoading, setFeedbackLoading] = useState(false)

  // Country and state data
  const countriesData = {
    "United States": ["California", "New York", "Texas", "Florida", "Illinois"],
    "France": ["Île-de-France", "Provence-Alpes-Côte d'Azur", "Auvergne-Rhône-Alpes"],
    "Japan": ["Kanto", "Kansai", "Chubu", "Kyushu"],
    "India": ["Maharashtra", "Karnataka", "Delhi", "Tamil Nadu"],
    "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
    "Germany": ["Berlin", "Bavaria", "Hamburg", "North Rhine-Westphalia"],
    "Australia": ["New South Wales", "Victoria", "Queensland", "Western Australia"],
    "Canada": ["Ontario", "Quebec", "British Columbia", "Alberta"]
  }

  const countryList = Object.keys(countriesData)

  // Update states when country changes
  useEffect(() => {
    if (formData.country && countriesData[formData.country]) {
      setStateList(countriesData[formData.country])
      setFormData(prev => ({ ...prev, state: '', city: '' }))
    } else {
      setStateList([])
    }
  }, [formData.country])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.country || !formData.city) {
      setError('Please select country and enter city name')
      return
    }

    if (!formData.start_date || !formData.end_date) {
      setError('Please select travel dates')
      return
    }

    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams({
        country: formData.country,
        city: formData.city,
        start_date: formData.start_date,
        end_date: formData.end_date
      })

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

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault()

    if (!feedback.trim()) {
      alert('Please enter your feedback')
      return
    }

    setFeedbackLoading(true)

    try {
      const feedbackData = {
        city: formData.city,
        country: formData.country,
        state: formData.state,
        feedback_type: "user_feedback",
        message: feedback,
        rating: 5
      }

      const response = await fetch(`${BACKEND_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData)
      })

      if (response.ok) {
        setFeedbackSubmitted(true)
        setTimeout(() => {
          setShowFeedback(false)
          setFeedbackSubmitted(false)
          setFeedback('')
        }, 2000)
      } else {
        throw new Error('Feedback submission failed')
      }
    } catch (err) {
      alert('Failed to submit feedback. Please try again.')
    } finally {
      setFeedbackLoading(false)
    }
  }

  // Home Page
  if (currentPage === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="text-center text-white max-w-2xl">
      <h1 className="text-5xl font-bold mb-4">🌍 Travel Safety Advisor</h1>
      <p className="text-xl mb-8 opacity-90">Get comprehensive safety advice for any destination in seconds</p>
      <button
      onClick={() => setCurrentPage('form')}
      className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
      >
      Start Your Journey →
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
      <div className="text-center mb-2">
      <button
      onClick={() => setCurrentPage('home')}
      className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4"
      >
      ← Back to Home
      </button>
      <h2 className="text-2xl font-bold text-gray-800">Plan Your Trip</h2>
      <p className="text-gray-600 text-sm">Enter your destination details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      {/* Country Dropdown */}
      <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
      🌎 Country
      </label>
      <select
      name="country"
      value={formData.country}
      onChange={handleInputChange}
      required
      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      >
      <option value="">Select a country</option>
      {countryList.map(country => (
        <option key={country} value={country}>{country}</option>
      ))}
      </select>
      </div>

      {/* State Dropdown */}
      <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
      🏛️ State/Region
      </label>
      <select
      name="state"
      value={formData.state}
      onChange={handleInputChange}
      disabled={!formData.country}
      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
      <option value="">Select state/region</option>
      {stateList.map(state => (
        <option key={state} value={state}>{state}</option>
      ))}
      </select>
      </div>

      {/* City Input */}
      <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
      🏙️ City
      </label>
      <input
      type="text"
      name="city"
      value={formData.city}
      onChange={handleInputChange}
      required
      placeholder="Enter city name"
      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
      />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
      <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
      📅 Start Date
      </label>
      <input
      type="date"
      name="start_date"
      value={formData.start_date}
      onChange={handleInputChange}
      required
      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      </div>
      <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
      📅 End Date
      </label>
      <input
      type="date"
      name="end_date"
      value={formData.end_date}
      onChange={handleInputChange}
      required
      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      </div>
      </div>

      <button
      type="submit"
      disabled={loading}
      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
      {loading ? (
        <div className="flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
        Getting Safety Advice...
        </div>
      ) : (
        'Get Safety Advice 🛡️'
      )}
      </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
        ⚠️ {error}
        </div>
      )}
      </div>
      </div>
    )
  }

  // Results Page
  if (currentPage === 'results' && advice) {
    const renderSection = (title, data, colorClass) => {
      if (!data) return (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
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
                <div className="flex items-start mb-1">
                <span className="text-green-500 mr-2">•</span>
                <span>{String(item)}</span>
                </div>
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
          <div className={`${colorClass} border rounded-xl p-6 transition-all duration-300 hover:shadow-lg`}>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
          {title}
          </h3>
          {typeof data === 'object' ? (
            <div className="space-y-3 text-sm">
            {Object.entries(data).map(([key, value]) => (
              <div key={key}>
              <span className="font-medium capitalize text-gray-700">{key.replace(/_/g, ' ')}:</span>
              <div className="mt-1">
              {renderValue(value)}
              </div>
              </div>
            ))}
            </div>
          ) : (
            <p className="text-gray-700">{String(data)}</p>
          )}
          </div>
        )
    }

    return (
      <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8 bg-white rounded-2xl p-6 shadow-lg relative">
      {/* Cute Feedback Button */}
      <button
      onClick={() => setShowFeedback(true)}
      className="absolute top-6 right-6 bg-gradient-to-r from-pink-400 to-red-400 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-pink-500 hover:to-red-500 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-1"
      >
      <span>💬</span>
      <span>Feedback</span>
      </button>

      <h1 className="text-4xl font-bold text-gray-800 mb-2">
      Safety Guide for {formData.city}, {formData.country}
      </h1>
      <p className="text-gray-600 text-lg">Travel Period: {formData.start_date} to {formData.end_date}</p>
      <div className="mt-4 bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-2 rounded-full inline-block text-sm font-medium">
      🎯 Your Personalized Travel Companion
      </div>
      </div>

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        {feedbackSubmitted ? (
          <div className="text-center py-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✅</span>
          </div>
          <h3 className="text-xl font-bold text-green-600 mb-2">Thank You!</h3>
          <p className="text-green-700">Your feedback has been submitted successfully.</p>
          </div>
        ) : (
          <>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">💬</span>
          Share Your Feedback
          </h3>
          <form onSubmit={handleFeedbackSubmit}>
          <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
          How can we improve?
          </label>
          <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Your suggestions, corrections, or compliments..."
          className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          required
          />
          </div>
          <div className="flex gap-3">
          <button
          type="submit"
          disabled={feedbackLoading}
          className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50 flex items-center justify-center"
          >
          {feedbackLoading ? (
            <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Sending...
            </>
          ) : (
            'Submit Feedback'
          )}
          </button>
          <button
          type="button"
          onClick={() => setShowFeedback(false)}
          className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-medium hover:bg-gray-600 transition-all"
          >
          Cancel
          </button>
          </div>
          </form>
          </>
        )}
        </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {renderSection('🛡️ Safety & Security', advice.safety_and_security, 'bg-red-50 border-red-200 text-red-900')}
      {renderSection('🏥 Health & Wellness', advice.health_and_wellness, 'bg-green-50 border-green-200 text-green-900')}
      {renderSection('🤝 Cultural Etiquette', advice.cultural_etiquette, 'bg-yellow-50 border-yellow-200 text-yellow-900')}
      {renderSection('🚨 Emergency Contacts', advice.emergency_contacts, 'bg-blue-50 border-blue-200 text-blue-900')}
      {renderSection('🌤️ Weather Forecast', advice.weather_forecast, 'bg-sky-50 border-sky-200 text-sky-900')}
      {renderSection('⚖️ Local Laws', advice.local_laws, 'bg-purple-50 border-purple-200 text-purple-900')}
      </div>

      {/* Action Buttons */}
      <div className="text-center space-x-4">
      <button
      onClick={() => {
        setCurrentPage('form')
        setAdvice(null)
      }}
      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
      >
      🔍 Search Another Destination
      </button>
      <button
      onClick={() => setCurrentPage('home')}
      className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all"
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
