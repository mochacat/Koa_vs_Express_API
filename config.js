module.exports = {
  port : process.env.PORT || 8080,
  mongodb : process.env.MONGODB || 'mongodb://localhost:27017/express_v_koa',
  framework : process.env.FRAMEWORK || 'koa'
}
