'use strict'

const uuid = require('uuid-base62')
const fixtures = {
  getImage () {
    return {
      description: 'an #Awesome picture with #tags #Miaugram',
      url: `https://miaugram.test/${uuid.v4().jpg}`,
      likes: 0,
      liked: false,
      userId: uuid.uuid()
    }
  },

  getImages (n) {
    let images = []
    while (n-- > 0) {
      images.push(this.getImage())
    }
    return images
  },

  getUser () {
    return {
      name: 'random',
      username: `user_${uuid.v4()}`,
      password: uuid.uuid(),
      email: `${uuid.v4()}@miaugram.test`
    }
  }
}

module.exports = fixtures
