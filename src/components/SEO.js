import React from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet"
import { useLocation } from "@reach/router"
import { useStaticQuery, graphql } from "gatsby"

const SEO = ({ title, description, image, article, section, slug, publishDate, modifiedDate }) => {
  const { pathname } = useLocation()
  console.log(pathname)
  const { site } = useStaticQuery(query)
  const {
    defaultTitle,
    defaultDescription,
    siteUrl,
  } = site.siteMetadata

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: image || `${siteUrl}/outlandnish.png`,
    url: `${siteUrl}${pathname}`,
    profile: { first_name: 'Nishanth', last_name: 'Samala', username: 'outlandnish', gender: 'male' },
    article: article,
    type: article ? 'article' : 'website'
  }

  let structuredData = null
  if (article)
    structuredData = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${siteUrl}${pathname}`
      },
      headline: seo.title,
      image: [seo.image],
      datePublished: publishDate,
      dateModified: modifiedDate,
      author: {
        "@type": "Person",
        name: "Nishanth Samala"
      },
      publisher: {
        "@type": "Organization",
        name: "Outlandnish",
        logo: {
          "@type": "ImageObject",
          url: seo.image
        },
      },
      description: seo.description
    }
  else
    structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "url": siteUrl,
      "logo": seo.image
    }

  return (
    <Helmet title={seo.title}>
      {/* Schema.org */}
      <meta itemprop="name" content="Nishanth Samala" />
      <meta itemprop="description" content={seo.description} />
      { seo.image && <meta itemprop="image" content={seo.image} /> }

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@outlandnish" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:creator" content="@outlandnish" />
      { seo.image && <meta name="twitter:image" content={`${seo.image}`} /> }
      <meta name="twitter:image:alt" content={seo.title} />

      {/* Open Graph */}
      <meta property="og:title" content={seo.title} />
      <meta property="og:type" content={seo.type} />
      <meta property="og:url" content={`${siteUrl}${pathname}`} />
      { seo.image && <meta property="og:image" content={seo.image} /> }
      <meta property="og:description" content={seo.description} />
      <meta property="og:site_name" content={seo.title} />

      {/* Open Graph Article */}
      { seo.article && <meta property="article:section" content={section} /> }
      { seo.article && <meta property="article:published_time" content={publishDate} /> }
      { seo.article && <meta property="article:modified_time" content={modifiedDate} /> }
      { seo.article && <meta property="article:author" content="Nishanth Samala" /> }

      {/* Open Graph Profile */}
      { seo.article && <meta property="profile:first_name" content={seo.profile.first_name} /> }
      { seo.article && <meta property="profile:last_name" content={seo.profile.last_name} /> }
      { seo.article && <meta property="profile:username" content={seo.profile.username} /> }
      { seo.article && <meta property="profile:gender" content={seo.profile.gender} /> }

      {/* Structured Data */}
      <script type="application/ld+json">
        { JSON.stringify(structuredData) }
      </script>
    </Helmet>
  )
}
export default SEO
SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  article: PropTypes.bool,
  type: PropTypes.string,
  profile: PropTypes.object
}
SEO.defaultProps = {
  title: null,
  description: null,
  image: null,
  article: false,
  type: null,
  profile: null
}
const query = graphql`
  query SEO {
    site {
      siteMetadata {
        defaultTitle: title
        defaultDescription: description
        siteUrl
      }
    }
  }
`