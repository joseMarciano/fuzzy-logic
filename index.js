const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)
const { SerialPort } = require('serialport')
const {Readable} = require('stream')
let connectionSocket = null


app.use('/', express.static('public'))
app.get('/', (req, res) => res.status(200).end())

io.on('connection', (socket) => {
  console.log('a user connected')
  connectionSocket = socket
  socket.on('disconnect', () => {
    connectionSocket = null
    console.log('user disconnected')
  })
})

server.listen(3000, () => {
  console.log('listening on *:3000')
})

const port = new SerialPort({
  path: '/dev/ttyUSB0',
  baudRate: 9600,
})

var jsonString = '';
port.on('data', function (data) {
  if (!connectionSocket)
    return

  var readable = Readable.from(data);

  readable.on('readable', function()  {
    let dataChunk;
    debugger
    while (null !== (dataChunk = readable.read())) {
      jsonString += dataChunk.toString()
    }
  })

  readable.on('end', () => {
    try {
      const json = JSON.parse(jsonString)
      console.log(json)
      connectionSocket.emit('data', json)  
      jsonString = '';
    } catch (error) {
    
    }
  });

})


port.on('close', () => console.log("Fechou"));
port.on('error', () => console.log("Deu pau"));
