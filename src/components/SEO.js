import React from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet"
import { useLocation } from "@reach/router"
import { useStaticQuery, graphql } from "gatsby"

const SEO = ({ title, description, image, article, publishDate, modifiedDate, tags }) => {
  const { pathname } = useLocation()
  console.log(pathname)
  const { site } = useStaticQuery(query)
  if (!tags)
    tags = []

  const {
    defaultTitle,
    defaultDescription,
    siteUrl,
    slogan,
    author
  } = site.siteMetadata

  const seo = {
    title: `${title} | ${defaultTitle}` || defaultTitle,
    description: description || defaultDescription,
    image: image || `${siteUrl}/outlandnish.png`,
    imageWide: image || `${siteUrl}/outlandnish-wide.png`,
    url: `${siteUrl}${pathname}`,
    profile: { first_name: 'Nishanth', last_name: 'Samala', username: 'outlandnish', gender: 'male' },
    article: article,
    type: article ? 'article' : 'website'
  }

  let section = pathname.indexOf('/hacks/') ? 'Hacks' : pathname.indexOf('/blog/') ? 'Blog' : '';

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
        name: author
      },
      publisher: {
        "@type": "Brand",
        name: defaultTitle,
        logo: {
          "@type": "ImageObject",
          url: seo.image
        },
        slogan: slogan
      },
      description: seo.description
    }
  else
    structuredData = {
      "@context": "https://schema.org",
      "@type": "Brand",
      name: defaultTitle,
      url: siteUrl,
      logo: seo.image,
      slogan: slogan
    }

  return (
    <Helmet title={seo.title}>
      <html lang="en" />
      <meta name="viewport"	content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"	/>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={tags.join(',')} />
      <link rel="canonical" href={`${siteUrl}${pathname}`} />

      {/* Schema.org */}
      <meta itemprop="name" content={author} />
      <meta itemprop="description" content={seo.description} />
      { seo.image && <meta itemprop="image" content={seo.image} /> }

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="OUTLNDNSH" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:creator" content="@outlandnish" />
      { seo.imageWide && <meta name="twitter:image" content={`${seo.imageWide}`} /> }
      <meta name="twitter:image:alt" content={seo.title} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:type" content={seo.type} />
      <meta property="og:url" content={`${siteUrl}${pathname}`} />
      { seo.imageWide && <meta property="og:image" content={seo.imageWide} /> }
      <meta property="og:description" content={seo.description} />
      <meta property="og:site_name" content={defaultTitle} />

      {/* Open Graph Article */}
      { seo.article && <meta property="og:article:section" content={section} /> }
      { seo.article && <meta property="og:article:published_time" content={publishDate} /> }
      { seo.article && <meta property="og:article:modified_time" content={modifiedDate} /> }
      { seo.article && <meta property="og:article:author" content={author} /> }

      {/* Open Graph Profile */}
      { seo.article && <meta property="og:profile:first_name" content={seo.profile.first_name} /> }
      { seo.article && <meta property="og:profile:last_name" content={seo.profile.last_name} /> }
      { seo.article && <meta property="og:profile:username" content={seo.profile.username} /> }
      { seo.article && <meta property="og:profile:gender" content={seo.profile.gender} /> }

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
  imageWide: PropTypes.string,
  article: PropTypes.bool,
  type: PropTypes.string,
  profile: PropTypes.object
}
SEO.defaultProps = {
  title: null,
  description: null,
  image: null,
  imageWide: null,
  article: false,
  type: null,
  profile: null
}
const query = graphql`
  query SEO {
    site {
      siteMetadata {
        slogan
        defaultTitle: title
        defaultDescription: description
        siteUrl
        author
      }
    }
  }
`