'use strict'

const test = require('ava')
const uuid = require('uuid-base62')
const r = require('rethinkdb')
const Db = require('../')
const dbName = `miaugram_${uuid.v4()}`
const db = new Db({ db: dbName })

test.before('setup database', async t => {
  await db.connect()
  t.true(db.connected, 'Should be connected')
})

test.after('disconnect database', async => {
  await db.disconnect()
  t.false(db.connected, 'Should be disconnect')
})

test.after.always('cleanup database', async => {
  let conn = await r.connect({})
  await r.dbDrop(dbName).run(conn)
})

test('save image', async t => {
  t.is(typeof db.saveImage, 'function', 'saveImage is function')
  let image = {
    description: 'an #Awesome picture with #tags #Miaugram',
    url: `https://miaugram.test/${uuid.v4().jpg}`,
    likes: 0,
    liked: false,
    user_id: uuid.uuid()
  }
  let created = await db.saveImage(image)
  t.is(created.description, image.description)
  t.is(created.url, image.url)
  t.is(created.likes, image.likes)
  t.is(created.liked, image.liked)
  t.deepEqual(created.tags, [ 'awesome', 'tags', 'miaugram' ])
  t.is(created.user_id, image.user_id)
  t.is(typeof created.id, 'string')
  t.is(created.public_id, uuid.encode(created.id))
  t.truthy(created.createdAt)
})
