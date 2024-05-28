require("dotenv").config()
const http = require('http')
const app = require('./src/config/express.config')
const {Server} = require("socket.io")

const httpServer = http.createServer(app)

const io = new Server(httpServer, {
    cors:"*"
})
io.on("connection", (socket) => {
    console.log(socket)
})

httpServer.listen(process.env.PORT || 8080,process.env.SERVER_URL,(error) => {
    if (!error) {
        console.log("Server running on the port:8080")
    }
})

