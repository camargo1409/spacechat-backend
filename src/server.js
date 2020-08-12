const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const routes = require('./routes')
const cors = require('cors')

const connectedUsers = []
var messages = []

io.on('connection',socket =>{
    const {id} = socket.client

    connectedUsers.push(id)
    console.log(`${id} se conectou` );

    io.emit('new_connection',connectedUsers)
    socket.emit('history',messages)

    socket.on('message',(data)=>{
        const bodymessage = {
            author:socket.client.id,
            content:data
        }
        messages.push(bodymessage)
        io.emit('chat message',messages)
        
    })
    socket.on('disconnect',(reason) =>{
        console.log(reason);
        const index = connectedUsers.indexOf(socket.client.id)
        connectedUsers.splice(index,1)
        io.emit('user left',connectedUsers)
    })
    socket.on('typing',()=>{
      
        
        socket.broadcast.emit('user typing',`${socket.client.id} está digitando`)
    })
})


setInterval(()=>{
    if(messages.length >= 20){
        messages.splice(0,Math.floor(messages.length/2))
        
    }
},10000)
app.get('/log',(req,res)=>{
    return res.json(messages)
})

app.use(cors());
app.use(express.json())

app.use((req,res,next) =>{
    req.io = io
    req.connectedUsers = connectedUsers
    return next()
})

app.use(routes)



server.listen(process.env.PORT || 3001)