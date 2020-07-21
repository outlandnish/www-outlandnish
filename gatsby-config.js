require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
})

const contentfulConfig = {
  spaceId: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
}

const { spaceId, accessToken } = contentfulConfig

if (!spaceId || !accessToken) {
  throw new Error(
    'Contentful spaceId and the access token need to be provided.'
  )
}

let siteUrl = `https://outlandnish.com`
let email = `hey@outlandnish.com`

module.exports = {
  siteMetadata: {
    title: 'OUTLNDNSH',
    description: `Hacks, racing, adventure, and other thoughts by Nishanth Samala`,
    slogan: "Leap before you look",
    author: "Nishanth Samala",
    siteUrl: siteUrl,
    email: email,
    links: {
      github: `https://github.com/outlandnish`,
      instagram: `https://instagram.com/outlandnish`,
      spotify: `https://open.spotify.com/user/nishanthsamala?si=hdglQJ9LQlKRSQkxANMrhg`,
      rss: `feed.xml`
    }
  },
  pathPrefix: '/',
  plugins: [
    'gatsby-transformer-sharp',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-source-contentful',
      options: contentfulConfig,
    },
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'OUTLNDNSH',
        short_name: 'OUTLNDNSH',
        start_url: '/',
        icon: `src/images/outlandnish.png`,
        icon_options: {
          purpose: 'maskable'
        },
        background_color: '#ffffff',
        theme_color: `#10893E`,
        display: 'browser'
      }
    },
    `gatsby-plugin-catch-links`,
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        timeToRead: wordCount => wordCount / 42,
        plugins: [
          `gatsby-remark-vscode`,          
          {
            resolve: `@raae/gatsby-remark-oembed`,
            options: {
              providers: {
                exclude: ['Twitter', 'Instagram']
              }
            }
          },
          {
            resolve: `gatsby-remark-images-contentful`,
            options: {
              maxWidth: 840,
              showCaptions: true,
              markdownCaptions: true,
              sizeByPixelDensity: true,
            }
          },
          `gatsby-remark-responsive-iframe`,
          `gatsby-remark-katex`
        ]
      }
    },
    {
      resolve: `gatsby-plugin-feed-generator`,
      options: {
        rss: true,
        json: true,
        siteQuery: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                author
                managingEditor: email
              }
            }
          }
        `,
        feeds: [
          {
            name: 'feed',
            query: `
              {
                allContentfulBlogPost(sort: { order: DESC, fields: [publishDate] }) {
                  edges {
                    node {
                      title
                      description {
                        description
                      }
                      slug
                      tags
                      body {
                        childMarkdownRemark {
                          html
                        }
                      }
                      publishDate
                    }
                  }
                }
              }
            `,
            normalize: ({ query: { site, allContentfulBlogPost }}) => {
              return allContentfulBlogPost.edges.map(edge => {
                return {
                  title: edge.node.title,
                  description: edge.node.description.description,
                  date: edge.node.publishDate,
                  url: `${site.siteMetadata.siteUrl}/blog/${edge.node.slug}`,
                  author: site.siteMetadata.author,
                  categories: edge.node.tags,
                  html: edge.node.body.childMarkdownRemark.html,
                }
              })
            }
          }
        ]
      }
    },
    `gatsby-plugin-advanced-sitemap`,
    {
			resolve: `gatsby-plugin-netlify`,
			options: {
				allPageHeaders: [
					'X-Frame-Options: SAMEORIGIN',
					'X-Content-Type-Options: nosniff',
					'Referrer-Policy: strict-origin-when-cross-origin',
					'Feature-Policy: none'
				]
			}
		},
		{
			resolve: `gatsby-plugin-robots-txt`,
			options: {
				policy: [{ userAgent: '*', disallow: [] }],
			}
		}
  ],
}
