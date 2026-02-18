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
