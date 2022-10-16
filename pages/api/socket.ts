import { Server } from 'Socket.IO'
import messageHandler from "../../utils/sockets/messageHandler";


const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Already set up");
    res.end();
    return;
  }

  console.log('Socket is initializing')
  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log("a user connected");
    messageHandler(io, socket);
  });
  res.end()
}

export default SocketHandler