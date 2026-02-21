import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setError('All fields are required')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    // In production, you would send this to your backend or email service
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setFormData({ name: '', email: '', subject: '', message: '' })

    // Reset submitted message after 5 seconds
    setTimeout(() => {
      setSubmitted(false)
    }, 5000)
  }

  return (
    <div className="max-w-3xl mx-auto p-6 text-black">
      <Helmet>
        <title>Contact Us - EchoNews</title>
        <meta name="description" content="Contact EchoNews. We'd love to hear your feedback, questions, or story tips." />
        <link rel="canonical" href="https://echonewsgh.site/contact" />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

      <p className="mb-8 text-lg">
        Have a question, suggestion, or news tip? We'd love to hear from you. Fill out the form below or reach out directly via email.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Direct Contact</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Email</h3>
              <a href="mailto:info@echonewsgh.site" className="text-blue-600 hover:underline break-all">
                info@echonewsgh.site
              </a>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Story Tips</h3>
              <a href="mailto:tips@echonewsgh.site" className="text-blue-600 hover:underline break-all">
                tips@echonewsgh.site
              </a>
            </div>
            <div>
              <h3 className="font-semibold mb-2">General Enquiries</h3>
              <p className="text-slate-700">Contact us via our contact form or email address above.</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Response Time</h2>
          <p className="text-slate-700 mb-4">
            We aim to respond to all inquiries within 2-3 business days. During peak news cycles, response time may be longer.
          </p>
          <h2 className="text-xl font-bold mb-4 mt-6">How We Use Your Information</h2>
          <p className="text-slate-700 text-sm">
            Information provided through this contact form is used solely to respond to your inquiry. We respect your privacy and do not share your information with third parties.
          </p>
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Send us a Message</h2>

        {submitted && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            ✓ Thank you for your message! We'll be in touch soon.
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            ✗ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-semibold mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-semibold mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block font-semibold mb-2">
              Subject *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What is this about?"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label htmlFor="message" className="block font-semibold mb-2">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message..."
              rows="6"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}
