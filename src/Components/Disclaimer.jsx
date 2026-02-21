import React from 'react'
import { Helmet } from 'react-helmet-async'

export default function Disclaimer() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-black">
      <Helmet>
        <title>Disclaimer - EchoNews</title>
        <meta name="description" content="Legal disclaimer for EchoNews. Please review this important information about our content." />
        <link rel="canonical" href="https://echonewsgh.site/disclaimer" />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">Disclaimer</h1>

      <p className="mb-6 text-sm text-slate-600">
        Last Updated: February 2026
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">General Disclaimer</h2>
        <p>
          The information provided on EchoNews is for general informational purposes only. While we strive to provide accurate and up-to-date information, EchoNews makes no warranties or representations regarding the accuracy, completeness, or reliability of the information contained herein.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">News Content</h2>
        <p className="mb-4">
          All news articles published on EchoNews are intended to represent news and current events. However:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Articles are based on available information at the time of publication</li>
          <li>Information may change or be updated as new information becomes available</li>
          <li>Opinions expressed may not reflect the position of EchoNews</li>
          <li>Headlines and summaries are intended to reflect the general content of an article</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Third-Party Content & Links</h2>
        <p>
          EchoNews may contain links to third-party websites. We are not responsible for the content, accuracy, or practices of these external sites. Linking to a third-party site does not constitute an endorsement. Users access external sites at their own risk.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">No Professional Advice</h2>
        <p>
          The content on EchoNews is not intended to provide professional advice including, but not limited to, medical, legal, financial, or professional services advice. For such advice, please consult with qualified professionals.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, EchoNews shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, arising from your use of or reliance upon any content on our website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Corrections & Retractions</h2>
        <p className="mb-4">
          EchoNews strives for accuracy in all published content. If you believe an error has been made:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Please contact us at <a href="mailto:corrections@echonewsgh.site" className="text-blue-600 hover:underline">corrections@echonewsgh.site</a></li>
          <li>Provide specific details about the error and supporting information</li>
          <li>Allow reasonable time for our team to investigate and respond</li>
          <li>Corrections will be made promptly when errors are confirmed</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">User-Generated Content</h2>
        <p>
          Comments and user-generated content on EchoNews do not represent the views of EchoNews. We are not responsible for comments or user-generated content, though we reserve the right to moderate, edit, or remove inappropriate content.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Copyright & Intellectual Property</h2>
        <p className="mb-4">
          All content on EchoNews, including text, images, logos, and design, is the intellectual property of EchoNews unless otherwise noted. Unauthorized reproduction or distribution of content is prohibited.
        </p>
        <p>
          If you believe your intellectual property rights have been violated, please contact us at <a href="mailto:legal@echonewsgh.site" className="text-blue-600 hover:underline">legal@echonewsgh.site</a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">No Warranty</h2>
        <p>
          THE WEBSITE AND ALL CONTENT ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Changes to This Disclaimer</h2>
        <p>
          EchoNews may update this disclaimer at any time. Your continued use of the website following the posting of revised terms means that you accept and agree to the changes.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Questions?</h2>
        <p>
          If you have questions about this disclaimer, please contact us at <a href="mailto:info@echonewsgh.site" className="text-blue-600 hover:underline">info@echonewsgh.site</a>
        </p>
      </section>
    </div>
  )
}
