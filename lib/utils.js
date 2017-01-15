'use strict'

const crypto = require('crypto')
const utils = {
  extractTags,
  normalize,
  encrypt
}
// This function found the words with hashtags
function extractTags (text) {
  if (text == null) return []

  let matches = text.match(/#(\w+)/g)
  if (matches === null) return []
  // The words with hashtags are transformed in words in lowercase and without hashtags
  matches = matches.map(normalize)
  return matches
}
// This function transform the found words with hashtags to words in lowercase without hashtags
function normalize (text) {
  text = text.toLowerCase()
  text = text.replace(/#/g, '')
  return text
}
// This function encrypts the password with sha256
function encrypt (password) {
  let shasum = crypto.createHash('sha256')

  shasum.update(password)

  return shasum.digest('hex')
}

module.exports = utils
