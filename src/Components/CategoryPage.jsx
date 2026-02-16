import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { db } from '../firebase'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'

export default function CategoryPage() {
  const { category } = useParams()
  const navigate = useNavigate()
  const [items, setItems] = useState([])

  useEffect(() => {
    if (!category) return
    const key = decodeURIComponent(category)
    ;(async () => {
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
      }
    })()
  }, [category])

  if (!category) return null

  const key = decodeURIComponent(category)

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{key}</h1>
        <button onClick={() => navigate(-1)} className="text-sm px-3 py-1 bg-slate-200 rounded-md">Back</button>
      </div>

      <div className="space-y-4">
        {items.length === 0 && <div className="text-slate-500">No articles found for {key}.</div>}
        {items.map(item => (
          <article key={item.id} onClick={() => navigate(`/article/${item.id}`)} className="cursor-pointer bg-white rounded-md shadow-sm p-4 flex gap-4 hover:shadow-md">
            <img src={item.image} alt="" className="w-36 h-24 object-cover rounded" />
            <div>
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-sm text-slate-500 mt-1">{item.details && item.details.slice(0, 140)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
