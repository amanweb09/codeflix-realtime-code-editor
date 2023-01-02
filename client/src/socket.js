import { io } from 'socket.io-client'

export const initSocket = async () => {

    const SERVER_ADDRESS = import.meta.env.REACT_APP_SERVER_URL || "http://localhost:5000"

    const options = {
        'force new connection': true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports: ['websocket']
    }

    return io(SERVER_ADDRESS, options)
}