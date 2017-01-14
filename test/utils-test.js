'use strict'

const test = require('ava')
const utils = require('../lib/utils')

test('extracting hashtags from text', t => {
  let tags = utils.extractTags('a #picture with tags #AwEzOmE #Miaugram #24 ##love')
  t.deepEqual(tags, [
    'picture',
    'awezome',
    'miaugram',
    '24',
    'love'
  ])
  tags = utils.extractTags('a picture with no tags')
  t.deepEqual(tags, [])

  tags = utils.extractTags()
  t.deepEqual(tags, [])

  tags = utils.extractTags(null)
  t.deepEqual(tags, [])
})
