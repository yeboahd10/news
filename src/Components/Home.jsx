import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES } from '../data/news'
import { db } from '../firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import Skeleton from './Skeleton'

export default function Home() {
  const navigate = useNavigate()
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    ;(async () => {
      try {
        const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'))
        const snap = await getDocs(q)
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        setNews(items)
      } catch (err) {
        console.error('Error fetching news:', err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl text-black font-extrabold">Top Trending</h1>
      </header>

      {loading ? (
        // Show skeleton loaders while loading
        <>
          {CATEGORIES.map(cat => (
            <div key={cat} className="mb-6">
              <h2 className="w-full text-xl font-semibold bg-black text-white p-2 rounded-md">{cat}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} variant="card" />
                ))}
              </div>
            </div>
          ))}
        </>
      ) : (
        // Show actual content when loaded
        <>
          {CATEGORIES.map(cat => {
            const items = news.filter(n => n.category === cat)
            const shown = items.slice(0, 3)
            return (
              <div key={cat} className="mb-6">
                <h2 className="w-full text-xl font-semibold bg-black text-white p-2 rounded-md">{cat}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {shown.map(item => {
                    const toDate = (ts) => {
                      if (!ts) return new Date(0)
                      if (ts.toDate) return ts.toDate()
                      if (ts.seconds) return new Date(ts.seconds * 1000)
                      if (typeof ts === 'number') return new Date(ts)
                      return new Date(ts)
                    }

                    const createdDate = toDate(item.createdAt)
                    const diffSec = Math.floor((Date.now() - createdDate.getTime()) / 1000)
                    let timeLabel
                    if (diffSec < 60) timeLabel = 'just now'
                    else if (diffSec < 3600) timeLabel = `${Math.floor(diffSec / 60)}m ago`
                    else if (diffSec < 86400) timeLabel = `${Math.floor(diffSec / 3600)}h ago`
                    else timeLabel = `${Math.floor(diffSec / 86400)}d ago`

                    return (
                      <article key={item.id} onClick={() => navigate(`/article/${item.id}`)} className="cursor-pointer flex items-center gap-4 bg-white/80 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                        <img src={item.image} alt="" className="w-36 h-24 object-cover rounded" />
                        <div className="p-4 flex-1 flex flex-col justify-center">
                          <h3 className="text-sm font-semibold leading-snug text-black">{item.title}</h3>
                          <div className="flex items-center justify-between mt-2">
                            <div className="text-xs text-black">{item.category}</div>
                            <div className="text-xs text-black">{timeLabel}</div>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>

                <div className="mt-2 flex justify-center">
                  {items.length > shown.length ? (
                    <button onClick={() => navigate(`/category/${encodeURIComponent(cat)}`)} className="w-full mt-2 text-center text-lg font-semibold border border-indigo-800 text-indigo-800 p-1 rounded-md hover:bg-indigo-700">More</button>
                  ) : (
                    <div className="w-1/2 text-center text-lg font-semibold p-1 text-slate-500">&nbsp;</div>
                  )}
                </div>
              </div>
            )
          })}
        </>
      )}
    </section>
  )
}

