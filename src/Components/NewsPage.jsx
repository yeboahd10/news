import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function NewsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [copied, setCopied] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const ref = doc(db, 'news', id)
        const snap = await getDoc(ref)
        if (!snap.exists()) {
          setItem(null)
        } else {
          setItem({ id: snap.id, ...snap.data() })
        }
      } catch (err) {
        console.error('Error loading article:', err)
        setItem(null)
      } finally {
        setVisible(true)
      }
    })()
  }, [id])

  if (!item) return (
    <div className="max-w-4xl mx-auto px-4 py-8">Loading....</div>
  )

  const url = typeof window !== 'undefined' ? window.location.href : ''

  function shareFacebook() {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    window.open(shareUrl, '_blank', 'noopener')
  }

  function shareWhatsApp() {
    const text = `${item.title} - ${url}`
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
    window.open(shareUrl, '_blank', 'noopener')
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      alert('Copy failed')
    }
  }

  return (
    <article className={`max-w-4xl mx-auto px-4 py-8 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <button onClick={() => navigate(-1)} className="mb-4 text-sm text-slate-700 hover:underline">← Back</button>
      <h1 className="text-2xl font-bold mb-4 text-black ">{item.title}</h1>
      <img src={item.image} alt={item.title} className="w-full h-auto rounded-md mb-6 object-cover" />

      <div className="prose max-w-none text-black  dark:text-slate-200 mb-6">
        <p>{item.details}</p>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={shareFacebook} title="Share on Facebook" aria-label="Share on Facebook" className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M22 12.07C22 6.49 17.52 2 12 2S2 6.49 2 12.07C2 17.09 5.66 21.26 10.44 22v-7.03H8.08v-2.9h2.36V9.41c0-2.33 1.39-3.61 3.52-3.61.99 0 2.03.18 2.03.18v2.23h-1.14c-1.13 0-1.48.7-1.48 1.42v1.7h2.52l-.4 2.9h-2.12V22C18.34 21.26 22 17.09 22 12.07z" />
          </svg>
        </button>

        <button onClick={shareWhatsApp} title="Share on WhatsApp" aria-label="Share on WhatsApp" className="p-2 rounded-md bg-green-600 text-white hover:bg-green-700">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.52 3.48A11.86 11.86 0 0012.01.02C6.26.02 1.48 4.8 1.48 10.55c0 1.86.49 3.68 1.42 5.28L.02 23.98l8.5-2.22c1.56.43 3.18.66 4.99.66 5.74 0 10.52-4.78 10.52-10.53 0-2.82-1.1-5.46-3.01-7.69zM12.01 20.24c-1.45 0-2.86-.39-4.06-1.12l-.29-.17-5.03 1.31 1.37-4.9-.19-.31a7.15 7.15 0 01-1.09-3.77c0-3.93 3.2-7.12 7.14-7.12 1.9 0 3.69.74 5.03 2.08a6.98 6.98 0 012.08 5.03c0 3.94-3.2 7.13-7.14 7.13z"/>
            <path d="M17.3 14.02c-.27-.13-1.6-.79-1.84-.88-.24-.09-.41-.13-.58.13s-.66.88-.81 1.06c-.15.17-.31.2-.58.07-.27-.13-1.14-.42-2.17-1.34-.8-.72-1.34-1.61-1.5-1.88-.16-.27-.02-.42.12-.55.12-.12.27-.31.4-.47.13-.16.17-.27.27-.45.09-.18.05-.34-.02-.47-.07-.13-.58-1.4-.8-1.92-.21-.51-.43-.44-.58-.45-.15-.01-.33-.01-.5-.01s-.47.07-.72.33c-.25.26-.97.95-.97 2.32 0 1.36.99 2.68 1.13 2.87.14.19 1.95 3 4.73 4.2 3.16 1.36 3.16.91 3.73.85.57-.06 1.84-.75 2.1-1.47.26-.72.26-1.34.18-1.47-.08-.14-.27-.21-.55-.34z"/>
          </svg>
        </button>

        <button onClick={copyLink} className="px-3 py-1 bg-slate-200 text-slate-800 rounded-md">{copied ? 'Copied!' : 'Copy link'}</button>
      </div>
    </article>
  )
}
