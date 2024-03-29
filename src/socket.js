import { io } from "socket.io-client"
const socketUrl = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/"
const socket = io(socketUrl)
export default socket
