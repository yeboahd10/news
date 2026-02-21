import React from 'react'
import { Helmet } from 'react-helmet-async'

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-black">
      <Helmet>
        <title>Privacy Policy - EchoNews</title>
        <meta name="description" content="Privacy policy for EchoNews. Learn how we collect and use data, and how to contact us." />
        <link rel="canonical" href="https://www.echonewsgh.site/privacy" />
      </Helmet>

      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">EchoNews respects your privacy. This page explains how we collect, use, and share information when you use our website.</p>

      <h2 className="text-lg font-semibold mt-4">Information Collection</h2>
      <p>We may collect information you provide directly (comments, names), and non-personal analytics data to improve the site.</p>

      <h2 className="text-lg font-semibold mt-4">Advertising</h2>
      <p>We may use third-party advertising services such as Google AdSense. These services may use cookies and other tracking technologies.</p>

      <h2 className="text-lg font-semibold mt-4">Contact</h2>
      <p>If you have questions about this policy, contact us via the site.</p>
    </div>
  )
}
