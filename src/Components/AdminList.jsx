import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../firebase'
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore'
import Skeleton from './Skeleton'

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

  const handleDeleteArticle = async (e, itemId) => {
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this article?')) return

    try {
      await deleteDoc(doc(db, 'news', itemId))
      setItems(items.filter(item => item.id !== itemId))
    } catch (err) {
      console.error('Error deleting article:', err)
      alert('Failed to delete article')
    }
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-black">Manage Articles</h1>
        <div className="flex gap-2">
          <button onClick={() => navigate('/admin')} className="px-3 py-1 bg-indigo-800 text-white rounded">New Article</button>
          <button onClick={() => window.location.reload()} className="px-3 py-1 border border-black rounded text-black">Refresh</button>
        </div>
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-md shadow-sm p-4">
              <Skeleton variant="list" />
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {!loading && items.length === 0 && <div className="text-black">No articles published yet.</div>}
        {!loading && items.map(item => (
          <article key={item.id} className="bg-white rounded-md shadow-sm p-4 hover:shadow-md">
            <div className="flex gap-4 items-start">
              <img src={item.image} alt="" className="w-36 h-24 object-cover rounded cursor-pointer flex-shrink-0" onClick={() => navigate(`/admin/edit/${item.id}`)} />
              <div className="flex-1 cursor-pointer" onClick={() => navigate(`/admin/edit/${item.id}`)}>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h2 className="text-sm text-black font-semibold flex-1">{item.title}</h2>
                
                </div>
                <div className="text-sm text-black mt-1">{item.category} — {item.createdAt && item.createdAt.toDate ? item.createdAt.toDate().toLocaleString() : ''}</div>
              </div>
            </div>
              <button onClick={(e) => handleDeleteArticle(e, item.id)} className="px-2 mt-2 p-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 flex-shrink-0 whitespace-nowrap">Delete</button>
          </article>
        ))}
      </div>
    </section>
  )
}
