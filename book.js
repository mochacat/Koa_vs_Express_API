'use strict' 

const mongoose = require('mongoose')

const bookSchema = mongoose.Schema({
  title : { type : 'String' },
  description : { type : 'String' },
  pages : { type : 'Number' },
  isbn13 : { type : 'Number' } ,
  author : { type : 'String' },
})

module.exports = mongoose.model('book', bookSchema)

