const mongoUtils = require('mongodb-utils')
const { db } = require('mono-mongodb')

const collection = mongoUtils(db.collection('todos'))

exports.create = collection.utils.create
exports.get = collection.utils.get
exports.find = collection.utils.find
exports.update = collection.utils.update
exports.delete = collection.utils.remove
