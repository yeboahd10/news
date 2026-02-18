// Generate URL-friendly slug from title
export function generateSlug(title) {
  if (!title) return 'article'
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .substring(0, 50) // Limit length
}

// Create article URL with slug and ID for uniqueness
export function createArticleUrl(title, id) {
  return `/article/${generateSlug(title)}/${id}`
}

// Extract ID from URL params
export function extractIdFromUrl(slug, id) {
  return id
}

// Ensure image URL is absolute (for social media sharing)
export function getAbsoluteImageUrl(imageUrl) {
  if (!imageUrl) return 'https://www.echonewsgh.site/vite.svg'
  
  // If already absolute, return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }
  
  // If relative path, make it absolute with live domain
  if (imageUrl.startsWith('/')) {
    return 'https://www.echonewsgh.site' + imageUrl
  }
  
  // Otherwise add domain
  return 'https://www.echonewsgh.site/' + imageUrl
}

// Get current page absolute URL
export function getAbsolutePageUrl() {
  if (typeof window === 'undefined') {
    return 'https://www.echonewsgh.site'
  }
  
  const url = window.location.href
  
  // If on localhost, replace with live domain
  if (url.includes('localhost')) {
    const path = window.location.pathname
    return 'https://www.echonewsgh.site' + path
  }
  
  return url
}
