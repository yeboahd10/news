import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { db } from '../firebase'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import Skeleton from './Skeleton'
import { createArticleUrl } from '../utils/slug'

export default function CategoryPage() {
  const { category } = useParams()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const formatDate = (ts) => {
    if (!ts) return ''
    const date = ts.toDate ? ts.toDate() : (ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts))
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatTime = (ts) => {
    if (!ts) return ''
    const date = ts.toDate ? ts.toDate() : (ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts))
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

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
  
  // Generate category description
  const categoryDescriptions = {
    'Politics': 'Latest political news, government updates, and policy coverage from EchoNews',
    'Entertainment': 'Entertainment news, celebrity updates, movies, music and showbiz stories',
    'Sports': 'Sports news, scores, rankings, and athletic updates from around the world',
    'Home': 'Latest breaking news and trending stories from Ghana and beyond'
  }
  
  const description = categoryDescriptions[key] || `${key} news and articles from EchoNews`
  const canonicalUrl = `https://echonewsgh.site/category/${key}`
  
  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://echonewsgh.site"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": key,
        "item": canonicalUrl
      }
    ]
  }
  
  // Category collection page schema
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${key} News - EchoNews`,
    "description": description,
    "url": canonicalUrl,
    "mainEntity": {
      "@type": "Thing",
      "name": key
    },
    "isPartOf": {
      "@type": "WebSite",
      "name": "EchoNews",
      "url": "https://echonewsgh.site"
    }
  }

  return (
    <>
      <Helmet>
        <title>{key} News - EchoNews | Latest Breaking News</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={`${key}, news, breaking news, ${key} updates`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${key} News - EchoNews`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="EchoNews" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${key} News - EchoNews`} />
        <meta name="twitter:description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        
        {/* Collection Page Schema */}
        <script type="application/ld+json">
          {JSON.stringify(collectionSchema)}
        </script>
      </Helmet>
    
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
            <article key={item.id} onClick={() => navigate(createArticleUrl(item.title, item.id))} className="cursor-pointer bg-white rounded-md shadow-sm p-4 flex gap-4 hover:shadow-md transition-shadow">
              <img src={item.image} alt="" className="w-36 h-24 object-cover rounded" />
              <div className="flex-1 flex flex-col justify-between">
                <h2 className="text-sm font-semibold text-black">{item.title}</h2>
                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <span>{formatDate(item.createdAt)}</span>
                  <span>{formatTime(item.createdAt)}</span>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
    </>
  )
}
