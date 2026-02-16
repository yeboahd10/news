import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Home from './Components/Home'
import NewsPage from './Components/NewsPage'
import CategoryPage from './Components/CategoryPage'
import AdminEditor from './Components/AdminEditor'
import AdminList from './Components/AdminList'

function App() {
  return (
    <BrowserRouter>
      <div className="app-root min-h-screen bg-white ">
        <Navbar />
        <main className="bg-white">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/:id" element={<NewsPage />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/admin" element={<AdminEditor />} />
            <Route path="/admin/list" element={<AdminList />} />
            <Route path="/admin/edit/:id" element={<AdminEditor />} />
          </Routes>
        </main>
        <footer className=" text-black text-center py-2 text-sm">
				© EchoNews 2026. All rights reserved.
			</footer>
      </div>
    </BrowserRouter>
  )
}

export default App
