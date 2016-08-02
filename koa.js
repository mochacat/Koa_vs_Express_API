"use strict"
require('babel-register')

const Koa = require('koa'),
  router = require('koa-router')(),
  config = require('./config'),
  mongoose = require('mongoose'),
  bodyParser = require('koa-bodyparser'),
  Book = require('./book')

const app = new Koa()
require('koa-validate')(app)

//connect to mongodb
mongoose.connect(config.mongodb)

mongoose.connection.on('error', () => {
  console.log('Mongodb connection error')
  proces.exit(1)
})

mongoose.connection.on('connected', () => {
  app.server = app.listen(config.port, e => {
    console.log('listening on', config.port, config.mongodb)
  })
})

//general error handling
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    console.error(err)
    handleErr()
  }
})

//error handling for api
function handleErr (ctx, code, type, errors) {
  ctx.status = code || 500
  ctx.type = 'jsonp'
  ctx.body = {
    "type" : type || "api_err",
    "errors" : errors || ["Something went wrong"]
  }
}

//populate with parsed body
app.use(bodyParser())

//create endpoints
//list all books
router.get('/books', async ctx => { 
  try {
    let results = await Book.find({}).exec()
    if (!results.length){
      handleErr(ctx, 404, "not_found", ["No books were found"])
    } else {
      ctx.body = results
    }  
  } catch (err) {
    handleErr(ctx, 500, "db_err", [err.message])
  }
})

//create a new book
router.post('/books', async ctx => {
  try {
    ctx.checkBody('title', 'Title is required').notEmpty()
    ctx.checkBody('author', 'Author is required').notEmpty()

    if (ctx.errors){
      handleErr(ctx, 422, "invalid_request", ctx.errors)
    } else {

      let book = new Book(ctx.request.body)
      let newBook = await book.save()
      if (!newBook){
        handleErr(ctx, 500, "db_err", ["Something went wrong"])
      } else {
        ctx.set('Location', '/book/' + book._id)
        ctx.status = 201
      }
    } 
  } catch (err) {
    handleErr(ctx, 500, "db_err", [err.message])
  }  
})

//find book by id
router.get('/book/:id', async ctx => {
  try {
    let book = await Book.find({ _id : ctx.params.id }).exec()
    if (!book.length){
      handleErr(ctx, 404, "not_found", ["Book does not exist"])
    } else {
      ctx.status = 200
      ctx.body = book
    }
  } catch (err) {
    handleErr(ctx, 500, "db_err", [err.message])
  }  
})

//update book by id
router.post('/book/:id', async ctx => {
  try {
    
    let book = await Book.findOneAndUpdate(
      { _id : ctx.params.id },
      { $set: ctx.request.body }
    )

    if (!book){
      handleErr(ctx, 404, "not_found", ["Book does not exist"])
    } else {
      ctx.set('Location', '/book/' + book._id)
      ctx.status = 200
    }
  
  } catch (err) {
    handleErr(ctx, 500, "db_err", [err.message])
  }  
})

//delete book by id
router.delete('/book/:id', async ctx => {
  try {  
    let book = await Book.findOneAndRemove({ _id : ctx.params.id })
    if (!book){
      handleErr(ctx, 404, "not_found", ["Book does not exist"])   
    } else {
      ctx.status = 204
    }
  } catch (err) {
    handleErr(ctx, 500, "db_err", [err.message])
  } 
})

app.use(router.routes())

module.exports = app
