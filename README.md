# Koa_vs_Express_API
Simple RESTful API example that illustrates the differences between Koa 2.x and Express frameworks

## Setup
1. `git clone https://github.com/mochacat/Koa_vs_Express_API.git`
2. `cd koa_vs_express_api`

###API is available on localhost:8080
- For Koa, `npm run koa`
- For Express, `npm run express`

## Available Endpoints

| Endpoints        | Description           | 
| ------------- |:-------------:| 
| GET /books      | Get list of all books |
| POST /books      | Create a new book      | 
| GET /book/:id | Get book fields by id      |
| POST /book/:id | Edit book fields     |
| DELETE /book/:id | Delete book by id    |

## Purpose

The goal of this project is to highlight the main differences between Koa 2.x and Express frameworks when building a RESTful API server.
Each framework has different options for dealing with asynchronous database calls, error handling, cascading middleware, node's request/response body, etc.
While this example doesn't explore each framework's capabilities in depth, it serves as a simple introduction. 

