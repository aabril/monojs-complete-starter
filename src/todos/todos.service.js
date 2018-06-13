const mongoUtils = require('mongodb-utils')
const { db } = require('mono-mongodb')

const collection = mongoUtils(db.collection('todos'))

// See https://github.com/mono-js/mongodb-utils#create
exports.create = collection.utils.create

// See https://github.com/mono-js/mongodb-utils#get
exports.get = collection.utils.get

// See https://github.com/mono-js/mongodb-utils#find
exports.find = collection.utils.find

// See https://github.com/mono-js/mongodb-utils#update
exports.update = collection.utils.update

// See https://github.com/mono-js/mongodb-utils#remove
exports.delete = collection.utils.remove
