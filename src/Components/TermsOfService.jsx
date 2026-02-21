import React from 'react'
import { Helmet } from 'react-helmet-async'

export default function TermsOfService() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-black">
      <Helmet>
        <title>Terms of Service - EchoNews</title>
        <meta name="description" content="Terms of Service for EchoNews. Please read these terms before using our website." />
        <link rel="canonical" href="https://echonewsgh.site/terms" />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <p className="mb-6 text-sm text-slate-600">
        Last Updated: February 2026
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
        <p>
          By accessing and using this website (echonewsgh.site), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
        <p className="mb-4">Permission is granted to temporarily download one copy of the materials (information or software) on EchoNews for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Modify or copy the materials</li>
          <li>Use the materials for any commercial purpose or for any public display</li>
          <li>Attempt to decompile, disassemble, or reverse engineer any software contained on the site</li>
          <li>Remove any copyright or other proprietary notations from the materials</li>
          <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          <li>Violate any applicable laws or regulations</li>
          <li>Access or use for any purpose any part of the website that is not expressly permitted</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">3. Disclaimer</h2>
        <p className="mb-4">
          The materials on EchoNews are provided on an 'as is' basis. EchoNews makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </p>
        <p>
          Further, EchoNews does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">4. Limitations</h2>
        <p>
          In no event shall EchoNews or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on EchoNews, even if EchoNews or an authorized representative has been notified orally or in writing of the possibility of such damage.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">5. Accuracy of Materials</h2>
        <p>
          The materials appearing on EchoNews could include technical, typographical, or photographic errors. EchoNews does not warrant that any of the materials on our website are accurate, complete, or current. EchoNews may make changes to the materials contained on our website at any time without notice.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">6. Materials and Content</h2>
        <p className="mb-4">
          Unless otherwise stated, EchoNews owns the intellectual property rights for all material on this website. All intellectual property rights are reserved. You may view and print pages from the website for personal use, subject to restrictions set in these terms and conditions.
        </p>
        <p>
          You must not:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Republish material from this website without clear attribution</li>
          <li>Sell, rent, or sub-license material from this website</li>
          <li>Reproduce, duplicate, or exploit material from this website for commercial purposes</li>
          <li>Redistribute content from EchoNews unless content is specifically made for redistribution</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">7. Links to Third-Party Websites</h2>
        <p>
          EchoNews has not reviewed all of the sites linked to our website and is not responsible for the contents of any linked site. The inclusion of any link does not imply endorsement by EchoNews of the site. Use of any such linked website is at the user's own risk.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">8. Modifications</h2>
        <p>
          EchoNews may revise these terms of service for our website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">9. Governing Law</h2>
        <p>
          These terms and conditions are governed by and construed in accordance with applicable laws, and you irrevocably submit to the exclusive jurisdiction of the courts located at our principal place of business.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">10. User Comments</h2>
        <p>
          In these terms and conditions, "User Comments" shall mean any audio, video, text, images, or other material you choose to display on our website. By displaying User Comments, you grant EchoNews a non-exclusive, worldwide irrevocable license to use, reproduce, adapt, publish, translate, and distribute it in any media.
        </p>
        <p className="mt-4">
          User Comments should not be illegal or unlawful, should not infringe upon the rights of others, and should not contain viruses or malware.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">11. Contact Information</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at <a href="mailto:info@echonewsgh.site" className="text-blue-600 hover:underline">info@echonewsgh.site</a>
        </p>
      </section>
    </div>
  )
}
