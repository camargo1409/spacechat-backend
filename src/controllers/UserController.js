module.exports = {
    index(req,res){
        const {connectedUsers} = req
        return res.json(connectedUsers)
    }
}