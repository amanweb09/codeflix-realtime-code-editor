const express = require('express')
const app = express()
const { Server } = require('socket.io')
const ACTIONS = require('./actions')

const server = require('http').createServer(app)
const io = new Server(server)

const userSocketMap = {}

function getAllConnectedClients(roomId) {
    return Array
        .from(io.sockets.adapter.rooms.get(roomId) || [])
        .map((socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId]
            }
        })
}

io.on('connection', (socket) => {

    socket.on(ACTIONS.JOIN, ({ username, roomId }) => {
        userSocketMap[socket.id] = username

        socket.join(roomId)
        const clients = getAllConnectedClients(roomId)

        clients.forEach(({ socketId }) => {
            io
                .to(socketId)
                .emit(ACTIONS.JOINED, {
                    clients,
                    username,
                    socketId: socket.id
                })
        })
    })

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        socket
            .in(roomId)
            .emit(ACTIONS.CODE_CHANGE, { code })
    })

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io
            .to(socketId)
            .emit(ACTIONS.CODE_CHANGE, { code })
    })

    socket.on('disconnecting', () => {
        const rooms = Array.from(socket.rooms) //get all rooms where this socketId is present
        rooms.forEach((roomId) => {
            socket
                .in(roomId)
                .emit(ACTIONS.DISCONNECTED, {
                    socketId: socket.id,
                    username: userSocketMap[socket.id]
                })
        })

        delete userSocketMap[socket.id]
        socket.leave()  //leaving the room
    })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log('listening on port ' + PORT))