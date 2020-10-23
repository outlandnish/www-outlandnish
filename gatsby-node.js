const Promise = require('bluebird')
const path = require('path')

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.js')
    resolve(
      graphql(
        `
          {
            allContentfulBlogPost {
              edges {
                node {
                  title
                  slug
                  tags
                }
              }
            }
          }
          `
      ).then(result => {
        if (result.errors) {
          console.error(result.errors)
          reject(result.errors)
        }

        const posts = result.data.allContentfulBlogPost.edges
        posts.forEach(({ node: post }, index) => {
          const partial = post.tags.indexOf('overshare') >= 0 ? 'overshare' : post.tags.indexOf('hack') >= 0 ? 'hacks' : 'blog'
          createPage({
            path: `/${partial}/${post.slug}/`,
            component: blogPost,
            context: {
              slug: post.slug
            },
          })
        })
      })
    )
  })
}
