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

test('encrypt password', t => {
  let password = 'qwerty12345'
  let encrypted = 'f6ee94ecb014f74f887b9dcc52daecf73ab3e3333320cadd98bcb59d895c52f5'
  let result = utils.encrypt(password)

  t.is(result, encrypted)
})
