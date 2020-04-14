export default (post) => {
  let content = post.body.childMarkdownRemark.html
  let wordCount = content.replace( /[^\w ]/g, "" ).split( /\s+/ ).length
  let readingTimeInMinutes = Math.floor(wordCount / 228) + 1
  return readingTimeInMinutes + " min read"
}