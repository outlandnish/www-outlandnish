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

module.exports = {
  siteMetadata: {
    title: 'OUTLNDNSH',
    description: `Nishanth Samala's home for projects, thoughts, hacks, racing, and other adventure`,
    slogan: "Run before you can walk",
    author: "Nishanth Samala",
    siteUrl: 'https://outlandnish.com'
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
              usePrefix: ['oembed', 'video']
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
