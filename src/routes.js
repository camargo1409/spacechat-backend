const routes = require('express').Router()
const UserController = require('./controllers/UserController')

routes.get('/',(req,res)=>{
    return res.send("oi")
})
routes.get('/users',UserController.index)

module.exports = routes