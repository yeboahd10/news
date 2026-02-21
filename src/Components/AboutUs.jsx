import React from 'react'
import { Helmet } from 'react-helmet-async'

export default function AboutUs() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-black">
      <Helmet>
        <title>About Us - EchoNews</title>
        <meta name="description" content="Learn about EchoNews. We're a trusted news platform delivering breaking news, politics, entertainment, and sports coverage." />
        <link rel="canonical" href="https://echonewsgh.site/about" />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">About EchoNews</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="mb-4">
          EchoNews is dedicated to delivering accurate, timely, and comprehensive news coverage to our readers. We believe in transparent journalism and providing factual information on politics, entertainment, sports, and other important topics affecting our communities.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">What We Cover</h2>
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold mb-2">Politics</h3>
            <p>In-depth coverage of political news, government updates, policy decisions, and elections.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Entertainment</h3>
            <p>Latest entertainment news, celebrity updates, movies, music, and showbiz events.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Sports</h3>
            <p>Comprehensive sports coverage including scores, analysis, rankings, and athletic updates.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Breaking News</h3>
            <p>Real-time updates on important events and trending stories from around the world.</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Accuracy and Factual Reporting</li>
          <li>Original, Quality Content</li>
          <li>Fair and Balanced Coverage</li>
          <li>Rapid Reporting of Breaking News</li>
          <li>Clear Distinction Between News and Opinion</li>
          <li>Respect for Privacy and Dignity</li>
          <li>Correction of Errors</li>
          <li>Transparent Editorial Standards</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Editorial Standards</h2>
        <p className="mb-4">
          All content published on EchoNews meets our strict editorial standards:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Every article is original and created by our editors</li>
          <li>Information is verified before publication</li>
          <li>Sources are cited appropriately</li>
          <li>We correct errors promptly and transparently</li>
          <li>Opinions are clearly labeled as such</li>
          <li>No plagiarism or content scraping</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
        <p className="mb-4">
          Have questions or feedback? We'd love to hear from you.
        </p>
        <div className="bg-slate-100 p-4 rounded-lg">
          <p><strong>Email:</strong> <a href="mailto:info@echonewsgh.site" className="text-blue-600 hover:underline">info@echonewsgh.site</a></p>
          <p><strong>Website:</strong> <a href="https://echonewsgh.site" className="text-blue-600 hover:underline">echonewsgh.site</a></p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Thank You</h2>
        <p>
          We're grateful for your trust and readership. EchoNews is committed to being your reliable source for news and information.
        </p>
      </section>
    </div>
  )
}
