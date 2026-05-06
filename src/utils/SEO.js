import React from "react";
import { Helmet } from "react-helmet-async";

/**
 * SEO Component — react-helmet-async ile dinamik meta etiketleri yönetimi.
 * Open Graph, Twitter Cards, schema.org yapısal veri ve canonical URL destekler.
 *
 * @param {object} props
 * @param {string} props.title       - Sayfa başlığı (varsayılan: "Umitcan Cinar | Portfolyo")
 * @param {string} props.description - Meta açıklama
 * @param {string} props.canonical   - Canonical URL
 * @param {string} props.image       - Paylaşım görseli URL (OG/Twitter)
 * @param {string} props.type        - OG type (varsayılan: "website")
 * @param {string} props.url         - Sayfa URL'si
 * @param {string} props.locale      - Dil (varsayılan: "tr_TR")
 * @param {object} props.schema      - Ek schema.org JSON-LD verisi
 */
function SEO({
  title = "Umitcan Cinar | Portfolyo",
  description = "Ümitcan Çinar - Kişisel Yazılım Portfolyosu. React, Node.js, Java ile modern web uygulamaları geliştiriyorum.",
  canonical,
  image = "https://www.umitcancinar.me/og-image.png",
  type = "website",
  url = "https://www.umitcancinar.me",
  locale = "tr_TR",
  schema,
}) {
  const siteUrl = "https://www.umitcancinar.me";
  const fullUrl = url.startsWith("http") ? url : `${siteUrl}${url}`;
  const canonicalUrl = canonical || fullUrl;
  const fullImage = image.startsWith("http") ? image : `${siteUrl}${image}`;

  // Varsayılan schema.org JSON-LD (WebSite + Kişisel Portfolyo)
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ümitcan Çinar",
    url: siteUrl,
    sameAs: [
      "https://github.com/umitcancinar",
      "https://www.linkedin.com/in/umitcancinar/",
      "https://twitter.com/umitcancinar",
      "https://instagram.com/umitcancinar",
    ],
    jobTitle: "Software Engineer",
    image: fullImage,
    description: description,
    knowsAbout: ["JavaScript", "React", "Node.js", "Java", "Web Development"],
  };

  const mergedSchema = schema
    ? { ...defaultSchema, ...schema }
    : defaultSchema;

  return (
    <Helmet>
      {/* Temel Meta */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content="Umitcan Cinar" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content="@umitcancinar" />
      <meta name="twitter:creator" content="@umitcancinar" />

      {/* schema.org Yapısal Veri (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify(mergedSchema)}
      </script>
    </Helmet>
  );
}

export default SEO;
