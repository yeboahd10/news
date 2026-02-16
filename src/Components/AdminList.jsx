import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'

export default function AdminList() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'))
        const snap = await getDocs(q)
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        setItems(docs)
      } catch (err) {
        console.error('Error loading admin list:', err)
        setItems([])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Articles</h1>
        <div className="flex gap-2">
          <button onClick={() => navigate('/admin')} className="px-3 py-1 bg-indigo-800 text-white rounded">New Article</button>
          <button onClick={() => window.location.reload()} className="px-3 py-1 border rounded">Refresh</button>
        </div>
      </div>

      {loading && <div className="text-slate-500">Loading...</div>}

      <div className="space-y-3">
        {!loading && items.length === 0 && <div className="text-slate-500">No articles published yet.</div>}
        {items.map(item => (
          <article key={item.id} onClick={() => navigate(`/admin/edit/${item.id}`)} className="cursor-pointer bg-white rounded-md shadow-sm p-4 flex gap-4 hover:shadow-md">
            <img src={item.image} alt="" className="w-36 h-24 object-cover rounded" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <div className="text-sm text-slate-500 mt-1">{item.category} — {item.createdAt && item.createdAt.toDate ? item.createdAt.toDate().toLocaleString() : ''}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
