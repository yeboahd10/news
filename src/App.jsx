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
              <Route path="/admin" element={<AdminEditor />} />
              <Route path="/admin/list" element={<AdminList />} />
              <Route path="/admin/edit/:id" element={<AdminEditor />} />
            </Routes>
          </main>
          <footer className=" text-black text-center py-2 text-sm">
            <div className="mb-1">© EchoNews 2026. All rights reserved.</div>
            <div><a href="/privacy" className="text-sm text-sky-600 hover:underline">Privacy Policy</a></div>
          </footer>
        </div>
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default App
