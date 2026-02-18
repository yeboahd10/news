import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CATEGORIES } from '../data/news'
import { db } from '../firebase'
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore'

export default function AdminEditor() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [image, setImage] = useState('')
  const [text, setText] = useState('')
  const [source, setSource] = useState('')
  const [editorName, setEditorName] = useState('')
  const [selected, setSelected] = useState([])
  const [tags, setTags] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    ;(async () => {
      try {
        const ref = doc(db, 'news', id)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          const data = snap.data()
          setTitle(data.title || '')
          setImage(data.image || '')
          setText(data.details || '')
          setSource(data.source || '')
          setEditorName(data.editorName || '')
          setTags(Array.isArray(data.tags) ? data.tags.join(', ') : '')
          setSelected(data.category ? [data.category] : [])
        } else {
          alert('Article not found')
          navigate('/admin')
        }
      } catch (err) {
        console.error('Error loading article for edit:', err)
        alert('Failed to load article for editing')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  function toggleCategory(cat) {
    setSelected(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
  }

  function publish() {
    if (!title.trim()) return alert('Please enter a title')
    if (selected.length === 0) return alert('Select at least one category')

    setSaving(true)

    // safety timeout to avoid being stuck indefinitely
    const timeout = setTimeout(() => {
      if (saving) setSaving(false)
    }, 12000)

    ;(async () => {
      try {
        if (id) {
          // update existing doc: set to first selected category
          const parsedTags = tags.split(',').map(t => t.trim()).filter(t => t)
          await updateDoc(doc(db, 'news', id), {
            category: primary,
            title: title.trim(),
            image: image || `https://picsum.photos/seed/${Math.floor(Math.random()*1000)}/1200/600`,
            details: text || 'No additional details provided.',
            source: source.trim(),
            editorName: editorName.trim(),
            tags: parsedTags,
            updatedAt: serverTimestamp()
          })
          // if additional categories selected, create new docs for them
          const extras = selected.slice(1)
          const extraTasks = extras.map(cat => addDoc(collection(db, 'news'), {
            category: cat,
            title: title.trim(),
            image: image || `https://picsum.photos/seed/${Math.floor(Math.random()*1000)}/1200/600`,
            details: text || 'No additional details provided.',
            source: source.trim(),
            editorName: editorName.trim(),
            tags: parsedTags,
            createdAt: serverTimestamp()
          }))
          if (extraTasks.length) await Promise.all(extraTasks)
        } else {
          const parsedTags = tags.split(',').map(t => t.trim()).filter(t => t)
          const tasks = selected.map(cat => addDoc(collection(db, 'news'), {
            category: cat,
            title: title.trim(),
            image: image || `https://picsum.photos/seed/${Math.floor(Math.random()*1000)}/1200/600`,
            details: text || 'No additional details provided.',
            source: source.trim(),
            editorName: editorName.trim(),
            tags: parsedTags,
            createdAt: serverTimestamp()
          }))
          await Promise.all(tasks)
        }

        alert(id ? 'Updated successfully' : 'Published successfully')
        setTags('')
        setTitle('')
        setImage('')
        setText('')
        setSource('')
        setEditorName('')
        setSelected([])
        navigate('/admin/list')
      } catch (err) {
        console.error('Error publishing/editing:', err)
        alert(`Failed to save: ${err?.message || err}`)
      } finally {
        clearTimeout(timeout)
        setSaving(false)
      }
    })()
  }

  return (
    <section className="max-w-3xl mx-auto px-4 py-8 text-black">
      <h1 className="text-2xl font-bold mb-4 text-black">Admin Editor</h1>
      {loading && <div className="text-sm text-black mb-2">Loading article...</div>}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-black">Categories</label>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map(cat => (
              <label key={cat} className="flex items-center gap-2 text-sm text-black">
                <input type="checkbox" checked={selected.includes(cat)} onChange={() => toggleCategory(cat)} />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-black">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded px-3 py-2 text-black"  placeholder="Article title" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-black">Image URL</label>
          <input value={image} onChange={e => setImage(e.target.value)} className="w-full border rounded px-3 py-2 text-black" placeholder="https://... or leave blank for placeholder" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-black">Source</label>
          <input value={source} onChange={e => setSource(e.target.value)} className="w-full border rounded px-3 py-2 text-black" placeholder="e.g., Reuters, Associated Press, etc." />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-black">Editor's Name</label>
          <input value={editorName} onChange={e => setEditorName(e.target.value)} className="w-full border rounded px-3 py-2 text-black" placeholder="Enter editor's name" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-black">Tags (SEO Keywords)</label>
          <input value={tags} onChange={e => setTags(e.target.value)} className="w-full border rounded px-3 py-2 text-black" placeholder="e.g., politics, ghana, election, news (comma-separated)" />
          <p className="text-xs text-slate-600 mt-1">Enter keywords separated by commas for better Google search indexing</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-black">Text</label>
          <textarea value={text} onChange={e => setText(e.target.value)} className="w-full border rounded px-3 py-2 min-h-[140px] text-black" placeholder="Write the article body or excerpt here..."></textarea>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-4">
            <button onClick={publish} disabled={saving} className="bg-indigo-800 text-white px-4 py-2 rounded hover:bg-indigo-700">{saving ? 'Saving...' : 'Publish'}</button>
            <button onClick={() => navigate('/admin/list')} className="px-4 py-2 border border-black rounded text-black">Manage Articles</button>
          </div>
          <button onClick={() => navigate(-1)} className="px-4 py-2 border border-black rounded text-black">Cancel</button>
        </div>
      </div>
    </section>
  )
}
