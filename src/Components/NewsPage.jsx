import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { db } from '../firebase'
import { doc, getDoc, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, updateDoc, deleteDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import Skeleton from './Skeleton'
import { getAbsoluteImageUrl, getAbsolutePageUrl } from '../utils/slug'

export default function NewsPage() {
  const { id, slug } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [copied, setCopied] = useState(false)
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [commenterName, setCommenterName] = useState('')
  const [posting, setPosting] = useState(false)
  const [visitorId, setVisitorId] = useState('')
  const [replyingId, setReplyingId] = useState(null)
  const [replyText, setReplyText] = useState('')

  // Add JSON-LD structured data and proper meta tags through Helmet
  useEffect(() => {
    if (!item) return
    
    const toDate = (ts) => {
      if (!ts) return new Date(0)
      if (ts.toDate) return ts.toDate()
      if (ts.seconds) return new Date(ts.seconds * 1000)
      if (typeof ts === 'number') return new Date(ts)
      return new Date(ts)
    }

    const createdDate = toDate(item.createdAt)
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": item.title,
      "description": item.title,
      "image": getAbsoluteImageUrl(item.image),
      "datePublished": createdDate.toISOString(),
      "dateModified": item.updatedAt ? toDate(item.updatedAt).toISOString() : createdDate.toISOString(),
      "author": {
        "@type": "Person",
        "name": item.editorName || "EchoNews"
      },
      "publisher": {
        "@type": "Organization",
        "name": "EchoNews",
        "logo": {
          "@type": "ImageObject",
          "url": "https://echonewsgh.site/logo.png"
        }
      },
      "keywords": Array.isArray(item.tags) ? item.tags.join(", ") : item.category
    }

    // Create and append script tag for JSON-LD
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(structuredData)
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [item])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
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
        setLoading(false)
      }
    })()
  }, [id])

  // subscribe to comments for this article (real-time)
  useEffect(() => {
    if (!id) return
    const q = query(collection(db, 'news', id, 'comments'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, snap => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setComments(list)
    }, err => {
      console.error('Comments listener error:', err)
    })

    return () => unsub()
  }, [id])

  // ensure a visitor id for like tracking and reporter id
  useEffect(() => {
    try {
      let vid = localStorage.getItem('visitorId')
      if (!vid) {
        vid = Math.random().toString(36).slice(2, 10)
        localStorage.setItem('visitorId', vid)
      }
      setVisitorId(vid)
    } catch (e) {
      setVisitorId('guest')
    }
  }, [])

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
      <div className="h-6 w-3/4 rounded skeleton" />
      <div className="w-full h-64 rounded skeleton" />
      <div className="space-y-2">
        <div className="h-4 w-full rounded skeleton" />
        <div className="h-4 w-5/6 rounded skeleton" />
        <div className="h-4 w-2/3 rounded skeleton" />
      </div>
    </div>
  )

  function formatText(text) {
    if (!text) return text
    // Replace **bold** with strong
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Replace _italic_ with em
    text = text.replace(/_([^_]+)_/g, '<em>$1</em>')
    return text
  }

  function renderArticleContent() {
    if (!item.details) return null
    
    const images = Array.isArray(item.images) ? item.images : []
    console.log('Article images:', images)
    console.log('Article details:', item.details)
    
    const parts = item.details.split(/(\[IMAGE:\d+\])/)
    
    return parts.map((part, idx) => {
      const imageMatch = part.match(/\[IMAGE:(\d+)\]/)
      if (imageMatch) {
        const imageIndex = parseInt(imageMatch[1])
        const imageUrl = images[imageIndex]
        
        console.log(`Image placeholder [IMAGE:${imageIndex}] found, URL:`, imageUrl)
        
        if (imageUrl && imageUrl.trim()) {
          return (
            <div key={idx} className="my-6 flex justify-center">
              <div className="max-w-2xl w-full">
                <img 
                  src={imageUrl} 
                  alt={`Article content ${imageIndex}`} 
                  className="w-full rounded-lg shadow-md object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          )
        } else {
          console.warn(`Image URL missing for [IMAGE:${imageIndex}]`)
          return null
        }
      }
      
      if (!part || !part.trim()) return null
      const formattedText = formatText(part)
      return (
        <div 
          key={idx} 
          className="whitespace-pre-wrap text-base leading-7"
          dangerouslySetInnerHTML={{ __html: formattedText }}
        />
      )
    })
  }

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

  function formatTime(ts) {
    if (!ts) return ''
    // return relative time like Facebook (e.g., "5m", "2h")
    const date = ts && ts.toDate ? ts.toDate() : (ts && ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts))
    const diff = Math.floor((Date.now() - date.getTime()) / 1000)
    if (diff < 60) return `${diff}s`
    if (diff < 3600) return `${Math.floor(diff/60)}m`
    if (diff < 86400) return `${Math.floor(diff/3600)}h`
    if (diff < 2592000) return `${Math.floor(diff/86400)}d`
    return date.toLocaleDateString()
  }

  async function postComment() {
    if (!commentText.trim()) return alert('Please write a comment')
    setPosting(true)
    try {
      await addDoc(collection(db, 'news', id, 'comments'), {
        name: commenterName.trim() || 'Anonymous',
        text: commentText.trim(),
        createdAt: serverTimestamp()
      })
      setCommentText('')
      setCommenterName('')
    } catch (err) {
      console.error('Failed to post comment:', err)
      alert('Failed to post comment')
    } finally {
      setPosting(false)
    }
  }

  async function postReply(parentId) {
    if (!replyText.trim()) return alert('Please write a reply')
    setPosting(true)
    try {
      await addDoc(collection(db, 'news', id, 'comments'), {
        name: commenterName.trim() || 'Anonymous',
        text: replyText.trim(),
        parentId,
        createdAt: serverTimestamp()
      })
      setReplyText('')
      setReplyingId(null)
    } catch (err) {
      console.error('Failed to post reply:', err)
      alert('Failed to post reply')
    } finally {
      setPosting(false)
    }
  }

  async function toggleLike(c) {
    if (!c || !c.id) return
    const ref = doc(db, 'news', id, 'comments', c.id)
    try {
      const liked = Array.isArray(c.likedBy) && c.likedBy.includes(visitorId)
      if (liked) {
        await updateDoc(ref, { likedBy: arrayRemove(visitorId) })
      } else {
        await updateDoc(ref, { likedBy: arrayUnion(visitorId) })
      }
    } catch (err) {
      console.error('Failed to toggle like:', err)
    }
  }

  async function deleteComment(commentId) {
    if (!commentId) return
    if (!confirm('Delete this comment?')) return
    try {
      await deleteDoc(doc(db, 'news', id, 'comments', commentId))
    } catch (err) {
      console.error('Failed to delete comment:', err)
      alert('Failed to delete comment')
    }
  }

  async function reportComment(commentId) {
    if (!commentId) return
    try {
      await addDoc(collection(db, 'news', id, 'reports'), {
        commentId,
        reporter: commenterName.trim() || visitorId || 'anonymous',
        createdAt: serverTimestamp()
      })
      alert('Reported — thank you')
    } catch (err) {
      console.error('Failed to report comment:', err)
      alert('Failed to report comment')
    }
  }

  return (
    <>
      <Helmet>
        <title>{item.title} - EchoNews</title>
        <meta name="description" content={item.title} />
        <meta property="og:title" content={item.title} />
        <meta property="og:description" content={item.title} />
        <meta property="og:image" content={getAbsoluteImageUrl(item.image)} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={getAbsolutePageUrl()} />
        <meta property="og:site_name" content="EchoNews" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={item.title} />
        <meta name="twitter:description" content={item.title} />
        <meta name="twitter:image" content={getAbsoluteImageUrl(item.image)} />
        <meta name="article:author" content={item.editorName || 'EchoNews'} />
        <meta name="article:section" content={item.category} />
        <link rel="canonical" href={getAbsolutePageUrl()} />
      </Helmet>
      <article className={`max-w-4xl mx-auto px-4 py-8 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <button onClick={() => navigate(-1)} className="mb-4 text-sm text-slate-700 hover:underline">← Back</button>
        <h1 className="text-2xl font-bold mb-4 text-black ">{item.title}</h1>
        <img src={item.image} alt={item.title} className="w-full h-auto rounded-md mb-6 object-cover" />

      <div className="mb-4 flex items-center justify-between text-sm text-slate-600 border-b pb-3">
        <span>By <strong>{item.editorName || 'Unknown Editor'}</strong></span>
        <span>Source: <strong>{item.source || 'Unknown Source'}</strong></span>
      </div>

      {/* Tags display for SEO */}
      {Array.isArray(item.tags) && item.tags.length > 0 && (
        <div className="mb-4 pb-3 border-b">
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag, idx) => (
              <span key={idx} className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold hover:bg-blue-200 cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="prose max-w-none text-black mb-6">
        {renderArticleContent()}
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

      {/* Comments section - Facebook-like */}
      <section className="mt-8">
        <h3 className="text-lg font-semibold mb-3 text-black  ">Comments ({comments.length})</h3>

        {/* Input row: avatar + input */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded p-4 bg-slate-300 flex items-center justify-center text-lg font-semibold text-black ">{(commenterName || 'You').slice(0,1).toUpperCase()}</div>
          <div className="flex-1">
            <textarea value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Write a public comment..." className="w-full text-black px-3 py-3 border rounded resize-none min-h-[80px] md:min-h-[100px]" />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2 text-sm text-black ">
                <input value={commenterName} onChange={e => setCommenterName(e.target.value)} placeholder="Your name (optional)" className="w-48 md:w-56 px-2 py-1 border text-black rounded text-sm" />
              </div>
              <div className="flex gap-2">
                <button onClick={postComment} disabled={posting} className="px-4 py-1 bg-blue-600 text-white rounded text-sm">{posting ? 'Posting...' : 'Comment'}</button>
                
              </div>
            </div>
          </div>
        </div>

        {/* Comments list with threading and actions */}
        <div className="space-y-3">
          {comments.length === 0 ? (
            <div className="text-sm text-black">No comments yet — be the first to comment.</div>
          ) : (
            // render top-level comments (no parentId)
            comments.filter(c => !c.parentId).map(c => {
              const replies = comments.filter(r => r.parentId === c.id).sort((a,b)=> (a.createdAt?.seconds||0)-(b.createdAt?.seconds||0))
              const likedBy = Array.isArray(c.likedBy) ? c.likedBy : []
              const liked = likedBy.includes(visitorId)
              return (
                <div key={c.id} className="">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center text-sm font-semibold text-black">{(c.name || 'A').slice(0,1).toUpperCase()}</div>
                    <div className="flex-1 bg-white/80 p-3 rounded">
                      <div className="flex items-center gap-3">
                        <strong className="text-sm text-black">{c.name || 'Anonymous'}</strong>
                        <span className="text-xs text-black">· {formatTime(c.createdAt)}</span>
                      </div>
                      <div className="mt-1 text-sm text-black">{c.text}</div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-black">
                        <button onClick={() => toggleLike(c)} className={`hover:underline ${liked ? 'text-blue-600' : ''}`}>Like{likedBy.length ? ` · ${likedBy.length}` : ''}</button>
                        <button onClick={() => setReplyingId(replyingId === c.id ? null : c.id)} className="hover:underline">Reply</button>
                        { (function(){ try { return localStorage.getItem('isAdmin') === 'true' } catch(e){ return false } })() && (
                          <button onClick={() => deleteComment(c.id)} className="hover:underline text-red-600">Delete</button>
                        )}
                        <button onClick={() => reportComment(c.id)} className="hover:underline text-amber-600">Report</button>
                      </div>

                      {/* Reply input for this comment */}
                      {replyingId === c.id && (
                      <div className="mt-3">
                          <textarea value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder="Write a reply..." className="w-full px-3 py-2 border rounded min-h-[80px]" />
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => postReply(c.id)} disabled={posting} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Reply</button>
                            <button onClick={() => { setReplyText(''); setReplyingId(null) }} className="px-3 py-1 border rounded text-sm">Cancel</button>
                          </div>
                        </div>
                      )}

                      {/* Replies */}
                      {replies.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {replies.map(r => {
                            const rLikedBy = Array.isArray(r.likedBy) ? r.likedBy : []
                            const rLiked = rLikedBy.includes(visitorId)
                            return (
                              <div key={r.id} className="flex gap-3 ml-12">
                                <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-xs font-semibold text-white">{(r.name || 'A').slice(0,1).toUpperCase()}</div>
                                <div className="flex-1 bg-white/80 p-2 rounded">
                                  <div className="flex items-center gap-2">
                                    <strong className="text-sm">{r.name || 'Anonymous'}</strong>
                                    <span className="text-xs text-slate-500">· {formatTime(r.createdAt)}</span>
                                  </div>
                                  <div className="text-sm text-slate-800">{r.text}</div>
                                  <div className="flex items-center gap-3 mt-1 text-sm text-slate-600">
                                    <button onClick={() => toggleLike(r)} className={`hover:underline ${rLiked ? 'text-blue-600' : ''}`}>Like{rLikedBy.length ? ` · ${rLikedBy.length}` : ''}</button>
                                    { (function(){ try { return localStorage.getItem('isAdmin') === 'true' } catch(e){ return false } })() && (
                                      <button onClick={() => deleteComment(r.id)} className="hover:underline text-red-600">Delete</button>
                                    )}
                                    <button onClick={() => reportComment(r.id)} className="hover:underline text-amber-600">Report</button>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </section>

      
      </article>
    </>
  )
}
