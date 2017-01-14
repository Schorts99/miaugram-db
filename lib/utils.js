'use strict'

const utils = {
  extractTags
}
// This function found the words with hashtags
function extractTags (text) {
  if (text == null) return []

  let matches = text.match(/#(\w+)/g)
  if (matches === null) return []
  matches = matches.map(normalize)
  return matches
}
// This function transform the found words with hashtags to words in lowercase without hashtags
function normalize (text) {
  text = text.toLowerCase()
  text = text.replace(/#/g, '')
  return text
}

module.exports = utils
