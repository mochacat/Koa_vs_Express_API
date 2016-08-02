"use strict"

const express = require('express'),
  config = require('./config'),
  morgan = require('morgan'),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  Book = require('./book')

//environment
const env = process.env.NODE_ENV || 'development'

const app = express()

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

//logging
if (env == 'development') app.use(morgan('tiny'))

//general error handling
app.use((err, req, res, next) => {
  if (err) {
    console.error(err)
    handleErr()
    next(err)
  }
})

//error handling for api
function handleErr(res, code, type, errors){
  res.status(code || 500)
    .jsonp({
      "type" : type || "server_err",
      "errors" : errors || "Something went wrong"
    })
}

//populate all req.body with parsed body
app.use(bodyParser.json())

//create endpoints
app.route('/books')

  //list all books
  .get((req,res) => { 
    Book.find({}).exec().then(results => {
      if (!results.length){
        handleErr(res, 404, "not_found", ["No books were found"])
      } else {
        res.status(200).send(results)
      }
    }).catch(err => {
      handleErr(res, 500, "db_err", [err.message])
    })
  })

  //create new book
  .post((req,res) => {
    
    req.assert('title', 'Title is required').notEmpty()
    req.assert('author', 'Author is required').notEmpty()
    
    const errors = req.validationErrors();

    if (errors){
      handleErr(res, 422, "invalid_request", errors)
    } else {

      const newBook = new Book(req.body)

      newBook.save().then( book => {
        if (!book){ 
          handleErr(res, 500, "db_err", ["Something went wrong"])
        } else { 
          res.status(201).set('Location', '/book/' + book._id).end()
        }
      }).catch( err => {
        handleErr(res, 500, "db_err", [err.message])
      })
    }  
  })

app.route('/book/:id')
  //find book by id
  .get((req,res) => {
    Book.find({ _id : req.params.id }).exec().then(book => {
      if (!book.length){
        handleErr(res, 404, "not_found", ["Book does not exist"])
      } else {
        res.status(200).send(book).end()
      }
    }).catch( err => {
      handleErr(res, 500, "db_err", [err.message])
    })  
  
  })

  //update book by id
  .post((req,res) => {
    Book.findOneAndUpdate(
      { _id : req.params.id },
      { $set: req.body }
    ).then( book => {
      if (!book){
        handleErr(res, 404, "not_found", ["Book does not exist"])
      } else{
        res.status(200).set('Location', '/book/' + book._id).end()
      }
    }).catch( err => {
      handleErr(res, 500, "db_err", [err.message])
    })  
  })

  //delete book by id
  .delete((req,res) => {
    Book.findOneAndRemove({ _id : req.params.id }).then( book => {
      if (!book){
        handleErr(res, 404, "not_found", ["Book does not exist"])
      } else {
        res.status(204).end()
      }
    }).catch( err => {
      handleErr(res, 500, "db_err", [err.message])
    }) 
  })


module.exports = app
