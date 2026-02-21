import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBwMHk7ZEC20Si2-9pzBJBiHER21SLPUYw",
  authDomain: "echonews-e759c.firebaseapp.com",
  projectId: "echonews-e759c",
  storageBucket: "echonews-e759c.firebasestorage.app",
  messagingSenderId: "255878334642",
  appId: "1:255878334642:web:db168bc02120fc8cc8e1ab"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const handler = async (event) => {
  try {
    const path = event.path;
    const match = path.match(/\/article\/([^/]+)\/([^/]+)/);
    
    if (!match) {
      return {
        statusCode: 404,
        body: 'Not Found',
      };
    }

    const [, slug, id] = match;

    // Fetch article from Firebase
    const docRef = doc(db, 'news', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return {
        statusCode: 404,
        body: 'Article Not Found',
      };
    }

    const article = docSnap.data();
    const imageUrl = article.image && article.image.startsWith('http') 
      ? article.image 
      : `https://www.echonewsgh.site/${article.image || 'vite.svg'}`;

    const pageUrl = `https://www.echonewsgh.site/article/${slug}/${id}`;
    const description = article.description || article.title.substring(0, 160);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="robots" content="index, follow">
    <title>${escapeHtml(article.title)} - EchoNews</title>
    
    <!-- Open Graph Meta Tags for Social Media Sharing -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="${pageUrl}">
    <meta property="og:title" content="${escapeHtml(article.title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="EchoNews">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${pageUrl}">
    <meta name="twitter:title" content="${escapeHtml(article.title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${imageUrl}">
    
    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": "${escapeJson(article.title)}",
      "description": "${escapeJson(description)}",
      "image": "${imageUrl}",
      "datePublished": "${article.createdAt?.toDate?.() || new Date().toISOString()}",
      "author": {
        "@type": "Person",
        "name": "${escapeJson(article.editorName || 'EchoNews')}"
      },
      "publisher": {
        "@type": "Organization",
        "name": "EchoNews",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.echonewsgh.site/vite.svg"
        }
      }
    }
    </script>
    
</head>
<body>
    <main>
      <article>
        <h1>${escapeHtml(article.title)}</h1>
        <p>${escapeHtml(description)}</p>
        <p><a href="${pageUrl}">Read on EchoNews</a></p>
      </article>
    </main>
</body>
</html>`;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=3600',
      },
      body: html,
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeJson(str) {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}
