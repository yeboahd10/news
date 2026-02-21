import React from 'react'
import { Helmet } from 'react-helmet-async'

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-black">
      <Helmet>
        <title>Privacy Policy - EchoNews</title>
        <meta name="description" content="Privacy policy for EchoNews. Learn how we collect and use data, and how to contact us." />
        <link rel="canonical" href="https://echonewsgh.site/privacy" />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-6 text-sm text-slate-600">
        Last Updated: February 2026
      </p>

      <p className="mb-4">EchoNews respects your privacy. This page explains how we collect, use, and share information when you use our website.</p>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
        <h3 className="font-semibold mb-2">Information You Provide</h3>
        <p className="mb-4">
          When you use our contact form, leave comments, or interact with our website, we may collect:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Name and email address (when you submit the contact form)</li>
          <li>Comments and feedback you post on articles</li>
          <li>Any other information you voluntarily provide</li>
        </ul>

        <h3 className="font-semibold mb-2">Information Collected Automatically</h3>
        <p>
          We may automatically collect non-personal analytics data including:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>IP address and device information</li>
          <li>Browser type and operating system</li>
          <li>Pages visited and time spent on site</li>
          <li>Referring website information</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
        <p>We use collected information to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Respond to your inquiries and comments</li>
          <li>Improve website functionality and user experience</li>
          <li>Analyze website performance and user behavior</li>
          <li>Comply with legal obligations</li>
          <li>Send occasional updates or newsletters (with your consent)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">3. Cookies & Tracking Technologies</h2>
        <p>
          EchoNews uses cookies and similar tracking technologies to improve your experience, analyze site usage, and serve relevant content. You can control cookie settings through your browser preferences.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">4. Third-Party Services</h2>
        <h3 className="font-semibold mb-2">Google Analytics</h3>
        <p className="mb-4">
          We use Google Analytics to track site usage and understand user behavior. Google Analytics collects data about your interaction with our website. For more information, visit <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline">Google's Privacy Policy</a>.
        </p>

        <h3 className="font-semibold mb-2">Google AdSense</h3>
        <p>
          We use third-party advertising services such as Google AdSense. These services may use cookies and other tracking technologies to serve ads based on your interests. Visit <a href="https://policies.google.com/technologies/ads" className="text-blue-600 hover:underline">Google Ads Settings</a> to manage ad preferences.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your information. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">6. Links to Third-Party Websites</h2>
        <p>
          Our website may contain links to third-party websites. We are not responsible for their privacy practices. We recommend reviewing their privacy policies before providing personal information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">7. Children's Privacy</h2>
        <p>
          EchoNews is not designed for children under 13. We do not intentionally collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">8. Your Rights</h2>
        <p>
          Depending on your location, you may have rights regarding your personal information, including access, correction, deletion, and portability. Contact us to exercise these rights.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">9. Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. Changes will be posted on this page with an updated "Last Updated" date. Your continued use of our website constitutes acceptance of the updated policy.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">10. Contact Us</h2>
        <p className="mb-4">
          If you have questions about this privacy policy or our privacy practices, please contact us:
        </p>
        <div className="bg-slate-100 p-4 rounded-lg">
          <p><strong>Email:</strong> <a href="mailto:privacy@echonewsgh.site" className="text-blue-600 hover:underline">privacy@echonewsgh.site</a></p>
          <p><strong>General:</strong> <a href="mailto:info@echonewsgh.site" className="text-blue-600 hover:underline">info@echonewsgh.site</a></p>
        </div>
      </section>
    </div>
  )
}
