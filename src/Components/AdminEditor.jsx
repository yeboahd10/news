import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CATEGORIES } from '../data/news'
import { db } from '../firebase'
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore'

export default function AdminEditor() {
  const navigate = useNavigate()
  const { id } = useParams()
  const textareaRef = useRef(null)
  const [title, setTitle] = useState('')
  const [image, setImage] = useState('')
  const [text, setText] = useState('')
  const [source, setSource] = useState('')
  const [editorName, setEditorName] = useState('')
  const [selected, setSelected] = useState([])
  const [tags, setTags] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [newImageUrl, setNewImageUrl] = useState('')
  const [showImageGuide, setShowImageGuide] = useState(true)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageLoadStatus, setImageLoadStatus] = useState(null) // 'loading', 'success', 'error'

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
          setImages(Array.isArray(data.images) ? data.images : [])
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

  function validateImageUrl(url) {
    return new Promise((resolve) => {
      setImageLoadStatus('loading')
      const img = new Image()
      
      img.onload = () => {
        setImageLoadStatus('success')
        setImagePreview(url)
        resolve(true)
      }
      
      img.onerror = () => {
        setImageLoadStatus('error')
        setImagePreview(null)
        resolve(false)
      }
      
      // Add timeout to prevent hanging on slow URLs
      setTimeout(() => {
        if (img.complete === false) {
          setImageLoadStatus('error')
          setImagePreview(null)
          resolve(false)
        }
      }, 5000)
      
      img.src = url
    })
  }

  function handleImageUrlChange(e) {
    const url = e.target.value
    setNewImageUrl(url)
    
    if (url.trim()) {
      validateImageUrl(url)
    } else {
      setImagePreview(null)
      setImageLoadStatus(null)
    }
  }

  function addImage() {
    if (!newImageUrl.trim()) {
      alert('Please enter an image URL')
      return
    }
    
    if (imageLoadStatus !== 'success') {
      alert('Please wait for the image to load successfully or check the URL')
      return
    }
    
    const newImages = [...images, newImageUrl.trim()]
    setImages(newImages)
    setNewImageUrl('')
    setImagePreview(null)
    setImageLoadStatus(null)
  }

  function removeImage(index) {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  function applyBold() {
    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = text.substring(start, end)
    if (!selectedText) return
    const newText = text.substring(0, start) + `**${selectedText}**` + text.substring(end)
    setText(newText)
    setTimeout(() => {
      textarea.selectionStart = start + 2
      textarea.selectionEnd = end + 2
      textarea.focus()
    }, 0)
  }

  function applyItalic() {
    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = text.substring(start, end)
    if (!selectedText) return
    const newText = text.substring(0, start) + `_${selectedText}_` + text.substring(end)
    setText(newText)
    setTimeout(() => {
      textarea.selectionStart = start + 1
      textarea.selectionEnd = end + 1
      textarea.focus()
    }, 0)
  }

  function insertImagePlaceholder(index) {
    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const placeholder = `[IMAGE:${index}]`
    const newText = text.substring(0, start) + placeholder + text.substring(start)
    setText(newText)
    setTimeout(() => {
      textarea.focus()
      textarea.selectionStart = start + placeholder.length
    }, 0)
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
        const primary = selected[0]
        const parsedTags = tags.split(',').map(t => t.trim()).filter(t => t)
        
        if (id) {
          // update existing doc: set to first selected category
          await updateDoc(doc(db, 'news', id), {
            category: primary,
            title: title.trim(),
            image: image || `https://picsum.photos/seed/${Math.floor(Math.random()*1000)}/1200/600`,
            details: text || 'No additional details provided.',
            source: source.trim(),
            editorName: editorName.trim(),
            tags: parsedTags,
            images: images,
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
            images: images,
            createdAt: serverTimestamp()
          }))
          if (extraTasks.length) await Promise.all(extraTasks)
        } else {
          const tasks = selected.map(cat => addDoc(collection(db, 'news'), {
            category: cat,
            title: title.trim(),
            image: image || `https://picsum.photos/seed/${Math.floor(Math.random()*1000)}/1200/600`,
            details: text || 'No additional details provided.',
            source: source.trim(),
            editorName: editorName.trim(),
            tags: parsedTags,
            images: images,
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
        setImages([])
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

        <div className="border-t pt-4">
          <h3 className="font-semibold text-black mb-3">Article Images</h3>
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex gap-2">
                <input 
                  value={newImageUrl} 
                  onChange={handleImageUrlChange} 
                  className="flex-1 border rounded px-3 py-2 text-black" 
                  placeholder="Paste image URL here (e.g., https://example.com/image.jpg)" 
                />
                <button 
                  onClick={addImage} 
                  disabled={imageLoadStatus !== 'success'}
                  className={`px-4 py-2 rounded transition-colors ${
                    imageLoadStatus === 'success' 
                      ? 'bg-green-700 text-white hover:bg-green-600' 
                      : 'bg-gray-400 text-white cursor-not-allowed'
                  }`}
                >
                  {imageLoadStatus === 'loading' ? 'Checking...' : 'Add Image'}
                </button>
              </div>

              {newImageUrl && (
                <div className="flex items-center gap-2 text-sm">
                  {imageLoadStatus === 'loading' && (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      <span className="text-blue-600">Validating image URL...</span>
                    </div>
                  )}
                  {imageLoadStatus === 'success' && (
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-semibold">✓ Image loaded successfully</span>
                    </div>
                  )}
                  {imageLoadStatus === 'error' && (
                    <div className="flex items-center gap-2">
                      <span className="text-red-600 font-semibold">✗ Failed to load image - check URL</span>
                    </div>
                  )}
                </div>
              )}

              {imagePreview && (
                <div className="bg-slate-100 p-2 rounded flex justify-center">
                  <img src={imagePreview} alt="Preview" className="max-h-32 object-contain rounded" />
                </div>
              )}
            </div>

            {images.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-slate-600 font-medium">Your Images ({images.length}):</p>
                {images.map((img, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-100 p-2 rounded">
                    <div className="flex-1 flex items-center gap-3">
                      <img src={img} alt={`Article ${idx}`} className="w-12 h-12 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-600 truncate">{img}</p>
                        <p className="text-xs text-slate-500 mt-1">To insert in text: <code className="bg-white px-1 rounded">[IMAGE:{idx}]</code></p>
                      </div>
                    </div>
                    <button 
                      onClick={() => insertImagePlaceholder(idx)} 
                      className="bg-blue-600 text-white px-3 py-1 text-xs rounded hover:bg-blue-500"
                    >
                      Insert
                    </button>
                    <button 
                      onClick={() => removeImage(idx)} 
                      className="bg-red-600 text-white px-3 py-1 text-xs rounded hover:bg-red-500"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-black">Article Text</label>
            <button 
              type="button"
              onClick={() => setShowImageGuide(!showImageGuide)}
              className="text-xs bg-slate-200 text-black px-2 py-1 rounded hover:bg-slate-300"
            >
              {showImageGuide ? 'Hide' : 'Show'} Guide
            </button>
          </div>

          {showImageGuide && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3 text-sm text-black">
              <p className="font-semibold mb-2">Formatting Guide:</p>
              <ul className="space-y-1 text-xs">
                <li><strong>Bold:</strong> Select text → Click Bold button OR use <code className="bg-white px-1">**text**</code></li>
                <li><strong>Italic:</strong> Select text → Click Italic button OR use <code className="bg-white px-1">_text_</code></li>
                <li><strong>Images:</strong> Click "Insert" button next to your image OR manually type <code className="bg-white px-1">[IMAGE:0]</code> where 0 is the image number</li>
              </ul>
            </div>
          )}

          <div className="flex gap-2 mb-2 flex-wrap">
            <button 
              type="button"
              onClick={applyBold}
              className="bg-slate-700 text-white px-3 py-1 rounded hover:bg-slate-600 text-sm font-bold"
            >
              B
            </button>
            <button 
              type="button"
              onClick={applyItalic}
              className="bg-slate-700 text-white px-3 py-1 rounded hover:bg-slate-600 text-sm italic"
            >
              I
            </button>
            {images.length > 0 && (
              <div className="flex gap-2">
                <span className="text-xs text-slate-600 py-1">Insert Image:</span>
                {images.map((_, idx) => (
                  <button 
                    key={idx}
                    type="button"
                    onClick={() => insertImagePlaceholder(idx)}
                    className="bg-slate-700 text-white px-2 py-1 rounded hover:bg-slate-600 text-xs"
                  >
                    IMG{idx}
                  </button>
                ))}
              </div>
            )}
          </div>

          <textarea 
            ref={textareaRef}
            value={text} 
            onChange={e => setText(e.target.value)} 
            className="w-full border rounded px-3 py-2 min-h-[200px] text-black font-mono text-sm" 
            placeholder="Write the article body here... Use [IMAGE:0], [IMAGE:1], etc. to insert images at specific locations"
          />
          <p className="text-xs text-slate-600 mt-2">
            💡 Tip: Add <code className="bg-slate-100 px-1">[IMAGE:0]</code> where you want the first image to appear
          </p>
        </div>

        {/* Live Preview */}
        <div className="border-t pt-4 mt-6">
          <h3 className="font-semibold text-black mb-3">Preview</h3>
          <div className="bg-slate-50 border rounded p-4 max-h-96 overflow-y-auto">
            {text ? (
              <div className="space-y-4">
                {text.split(/(\[IMAGE:\d+\])/).map((part, idx) => {
                  const imageMatch = part.match(/\[IMAGE:(\d+)\]/)
                  if (imageMatch) {
                    const imageIndex = parseInt(imageMatch[1])
                    const imageUrl = images[imageIndex]
                    return (
                      <div key={idx} className="my-4">
                        {imageUrl ? (
                          <div className="flex justify-center">
                            <img 
                              src={imageUrl} 
                              alt={`Preview ${imageIndex}`} 
                              className="max-w-xs h-auto rounded shadow"
                              onError={(e) => {
                                e.target.alt = 'Image failed to load - check URL'
                              }}
                            />
                          </div>
                        ) : (
                          <div className="bg-yellow-100 border border-yellow-300 p-3 rounded text-sm text-yellow-800">
                            [IMAGE:{imageIndex}] - No image added at index {imageIndex}
                          </div>
                        )}
                      </div>
                    )
                  }
                  
                  if (!part || !part.trim()) return null
                  
                  const formattedText = part
                    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                    .replace(/_([^_]+)_/g, '<em>$1</em>')
                  
                  return (
                    <div 
                      key={idx}
                      className="whitespace-pre-wrap text-sm text-black"
                      dangerouslySetInnerHTML={{ __html: formattedText }}
                    />
                  )
                })}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">Preview will appear here as you type...</p>
            )}
          </div>
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
