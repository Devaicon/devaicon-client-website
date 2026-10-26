import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import PageHero from "@/components/PageHero";

/**
 * A post bundled with the site (src/lib/insights-content), laid out as the
 * insight pages were before the content API. Used while INSIGHTS_SOURCE lets
 * those posts stand in for the API's.
 */
export default function StaticInsightArticle({ post }) {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <PageHero
        title={post.title}
        subtitle={post.subtitle}
        icon={<BookOpen className="w-7 h-7 text-white" />}
        label={post.category}
        buttonText="Back to Insights"
        buttonLink="/insights"
        showButton={true}
        backgroundImage={post.heroImage}
      />

      {/* Article Content */}
      <article className="max-w-5xl mx-auto px-6 sm:px-12 md:px-16 py-12 md:py-16">
        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#4555A7] to-[#7C5BA8] text-white text-xs font-semibold rounded">
              {post.category}
            </span>
            <span className="text-sm text-gray-500">{post.date}</span>
          </div>
        </header>

        {/* Hero Image */}
        <div className="relative w-full h-64 md:h-96 mb-12 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={post.heroImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article Body */}
        <div className="prose prose-lg max-w-none">
          {/* Top Section */}
          {post.content.topSection && (
            <section className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {post.content.topSection.title}
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                {post.content.topSection.subtitle}
              </p>
            </section>
          )}

          {/* Introduction Section */}
          {post.content.introduction && (
            <section className="mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                {post.content.introduction.title}
              </h3>

              {post.content.introduction.paragraphs.map((para, idx) => (
                <p
                  key={idx}
                  className="text-gray-700 leading-relaxed mb-6 text-lg"
                >
                  {para}
                </p>
              ))}

              {/* Introduction Image */}
              {post.content.introduction.image && (
                <div className="my-10">
                  <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-3 shadow-md">
                    <Image
                      src={post.content.introduction.image}
                      alt="Introduction visual"
                      fill
                      className="object-cover"
                    />
                  </div>
                  {post.content.introduction.imageCaption && (
                    <p className="text-sm text-gray-500 italic text-center">
                      {post.content.introduction.imageCaption}
                    </p>
                  )}
                </div>
              )}
            </section>
          )}

          {/* Quote Block */}
          {post.content.quote && (
            <blockquote
              className="my-12 pl-8 border-l-4 bg-gradient-to-br from-purple-50 to-blue-50 py-8 pr-8 rounded-r-lg shadow-sm"
              style={{ borderLeftColor: "#4555A7" }}
            >
              <p className="text-xl md:text-2xl font-medium text-gray-800 italic mb-3 leading-relaxed">
                &ldquo;{post.content.quote.text}&rdquo;
              </p>
              {/* <footer className="text-sm text-gray-600 font-semibold">
                — {post.content.quote.author}
              </footer> */}
            </blockquote>
          )}

          {/* Body Content Sections */}
          {post.content.body.map((section, idx) => {
            const isVitaSection =
              section.title ===
                "How Does Devaicon Enable Enterprise-Scale Agentic AI?" ||
              section.title ===
                "How Does Devaicon Enable AI-Powered Voice Assistants?" ||
              section.title ===
                "How Devaicon Enables Value with Microsoft Fabric?" ||
              section.title ===
                "How Does Devaicon Contribute to and Guarantee ROI-Driven Transformation?";

            return (
              <section
                key={idx}
                className={`mb-12 ${
                  isVitaSection
                    ? "bg-gray-200 shadow-lg p-8 md:p-12 rounded-lg border border-gray-300 hover:shadow-xl duration-300 transition-all"
                    : ""
                }`}
              >
                <h3
                  className={`text-2xl md:text-3xl font-bold mb-6 ${
                    isVitaSection ? "text-gray-800" : "text-gray-900"
                  }`}
                >
                  {section.title}
                </h3>
                <p
                  className={`leading-relaxed mb-6 text-lg ${
                    isVitaSection ? "text-gray-600" : "text-gray-700"
                  }`}
                >
                  {section.content}
                </p>

                {section.subtitle && (
                  <p
                    className={`font-semibold mb-4 text-lg ${
                      isVitaSection ? "text-gray-600" : "text-gray-800"
                    }`}
                  >
                    {section.subtitle}
                  </p>
                )}

                {section.listItems && (
                  <ul
                    className={`list-disc list-inside space-y-3 ml-4 mb-6 ${
                      isVitaSection ? "text-gray-600" : "text-gray-700"
                    }`}
                  >
                    {section.listItems.map((item, itemIdx) => (
                      <li key={itemIdx} className="text-lg leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {section.additionalText && (
                  <p
                    className={`leading-relaxed mb-4 text-lg mt-4 ${
                      isVitaSection ? "text-gray-600" : "text-gray-700"
                    }`}
                  >
                    {section.additionalText}
                  </p>
                )}
              </section>
            );
          })}

          {/* Body Image */}
          {post.content.bodyImage && (
            <div className="my-10">
              <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-3 shadow-md">
                <Image
                  src={post.content.bodyImage}
                  alt="Article visual"
                  fill
                  className="object-cover"
                />
              </div>
              {post.content.bodyImageCaption && (
                <p className="text-sm text-gray-500 italic text-center">
                  {post.content.bodyImageCaption}
                </p>
              )}
            </div>
          )}

          {/* Conclusion */}
          {post.content.conclusion && (
            <section className="mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                {post.content.conclusion.title}
              </h3>

              {post.content.conclusion.paragraphs.map((para, idx) => (
                <p
                  key={idx}
                  className="text-gray-700 leading-relaxed mb-6 text-lg"
                >
                  {para}
                </p>
              ))}

              {/* CTA Section */}
              {post.content.conclusion.cta && (
                <div className="mt-10 p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-[#4555A7]/20 shadow-sm">
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">
                    {post.content.conclusion.cta.title}
                  </h4>
                  <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                    {post.content.conclusion.cta.description}
                  </p>
                  <Link
                    href="/contact-us"
                    className="px-6 py-3 hover:shadow-lg text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105"
                    style={{ background: "#37469E" }}
                  >
                    Book a Session
                  </Link>
                </div>
              )}
            </section>
          )}
        </div>

        {/* Author Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex items-center justify-between flex-wrap gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900">
                {post.author.name}
              </h4>
              <p className="text-sm text-gray-600">{post.author.role}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-4 py-2 text-white text-xs font-semibold rounded-full shadow-sm"
                style={{ background: "#4A2D58" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}
