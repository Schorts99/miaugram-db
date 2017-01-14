'use strict'

const r = require('rethinkdb')
const co = require('co')
const Promise = require('bluebird')
const uuid = require('uuid-base62')
const utils = require('./utils')
// Default values to database connection
const defaults = {
  host: 'localhost',
  port: '28015',
  db: 'miaugram'
}

class Db {
  // Constructor to overwritte connection values in case that default values can't be able to use
  constructor (options) {
    options = options || {
      this.host = options.host || defaults.host
      this.port = options.port || defaults.port
      this.db = options.db || defaults.db
    }
  }

  connect (callback) {
    this.connection = r.connect({
      host: this.host,
      port: this.port
    })
    this.connected = true

    let db = this.db
    let connection = this.connection
    let setup = co.wrap(function * () {
      let conn = yield connection
      // If DB doesn't exist then it's created
      let dbList = yield r.dbList().run(conn)
      if (dbList.indexOf(db) === -1) {
        yield r.dbCreate(db).run(conn)
      }
      // If some of the tables doesn't exist will be created
      let dbTables = yield r.db(db).tableList().run(conn)
      if (dbTables.indexOf('images') === -1) {
        yield r.db(db).tableCreate('images').run(conn)

        if (dbTables.indexOf('users') === -1) {
          yield r.db(db).tableCreate('users').run(conn)
      }
      return conn
    })
    return Promise.resolve(setup()).asCallback(callback)
  }
  disconnect (callback) {
    if (!this.connected) {
      return Promise.reject(new Error('not connected')).asCallback(callback)
    }
    this.connected = false
    return Promise.resolve(this.connection)
      .then((conn) => conn.close())
  }
  saveImage (image, callback) {
    if (!this.connected) {
      return Promise.reject(new Error('not connected')).asCallback(callback)
    }
    let connection = this.connection
    let db = this.db
    let tasks = co.wrap(function * () {
      let conn = yield connection
      image.createdAt = new Date()
      image.tags = utils.extractTags(image.description)
      let result = yield r.db(db).table('images').insert(image).run(conn)
      if (result.errors > 0) {
        return Promise.reject(new Error(result.first_error))
      }
      image.id = result.generated_keys[0]
      // Here the id from the image is transformed into a public id
      yield r.db(db).table('images').get(image.id).update({
        public_id: uuid.encode(image.id)
      }).run(conn)
      // And here the immage updated with the id public is retorned 
      let created = yield r.db(db).table('images').get(image.id).run(conn)
      return Promise.resolve(created)
    })
    return Promise.resolve(tasks()).asCallback(callback)
  }
}

module.exports = Db