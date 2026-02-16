import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { db } from '../firebase'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import Skeleton from './Skeleton'

export default function CategoryPage() {
  const { category } = useParams()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!category) return
    const key = decodeURIComponent(category)
    ;(async () => {
      setLoading(true)
      try {
        // fetch matching category documents (avoid requiring composite index)
        const q = query(collection(db, 'news'), where('category', '==', key))
        const snap = await getDocs(q)
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        // sort by createdAt (safely handle serverTimestamp or missing values)
        docs.sort((a, b) => {
          const toMillis = (ts) => {
            if (!ts) return 0
            if (ts.toDate) return ts.toDate().getTime()
            if (ts.seconds) return ts.seconds * 1000
            if (typeof ts === 'number') return ts
            return new Date(ts).getTime()
          }
          return toMillis(b.createdAt) - toMillis(a.createdAt)
        })
        setItems(docs)
      } catch (err) {
        console.error('Error loading category items:', err)
        setItems([])
      } finally {
        setLoading(false)
      }
    })()
  }, [category])

  if (!category) return null

  const key = decodeURIComponent(category)

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-black">{key}</h1>
        <button onClick={() => navigate(-1)} className="text-sm px-3 py-1 bg-slate-200 rounded-md text-black">Back</button>
      </div>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-md shadow-sm p-4">
              <Skeleton variant="card" />
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="text-black">No articles in this category.</div>
        ) : (
          items.map(item => (
            <article key={item.id} onClick={() => navigate(`/article/${item.id}`)} className="cursor-pointer bg-white rounded-md shadow-sm p-4 flex gap-4 hover:shadow-md">
              <img src={item.image} alt="" className="w-36 h-24 object-cover rounded" />
              <div>
                <h2 className="text-sm font-semibold text-black">{item.title}</h2>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}
