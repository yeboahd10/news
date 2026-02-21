import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Navbar from './Components/Navbar'
import Home from './Components/Home'
import NewsPage from './Components/NewsPage'
import CategoryPage from './Components/CategoryPage'
import AdminEditor from './Components/AdminEditor'
import AdminList from './Components/AdminList'
import PrivacyPolicy from './Components/PrivacyPolicy'
import AboutUs from './Components/AboutUs'
import ContactUs from './Components/ContactUs'
import TermsOfService from './Components/TermsOfService'
import Disclaimer from './Components/Disclaimer'

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <div className="app-root min-h-screen bg-white ">
          <Navbar />
          <main className="bg-white">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/article/:slug/:id" element={<NewsPage />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/admin" element={<AdminEditor />} />
              <Route path="/admin/list" element={<AdminList />} />
              <Route path="/admin/edit/:id" element={<AdminEditor />} />
            </Routes>
          </main>
          <footer className="text-black text-center py-6 text-sm border-t border-slate-200">
            <div className="max-w-6xl mx-auto px-4">
              <div className="mb-4">© EchoNews 2026. All rights reserved.</div>
              <div className="flex flex-wrap justify-center gap-4 mb-4">
                <a href="/about" className="text-sky-600 hover:underline">About Us</a>
                <span className="text-slate-400">•</span>
                <a href="/contact" className="text-sky-600 hover:underline">Contact</a>
                <span className="text-slate-400">•</span>
                <a href="/privacy" className="text-sky-600 hover:underline">Privacy Policy</a>
                <span className="text-slate-400">•</span>
                <a href="/terms" className="text-sky-600 hover:underline">Terms of Service</a>
                <span className="text-slate-400">•</span>
                <a href="/disclaimer" className="text-sky-600 hover:underline">Disclaimer</a>
              </div>
              <div className="text-xs text-slate-500">
                EchoNews is committed to delivering accurate, original news and high-quality journalism.
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default App
