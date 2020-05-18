const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express();
const server = http.Server(app);
const io = socketio(server);

const title = 'Remote Quiz'

let data = {
  users: new Set(),
  buzzes: new Set(),
}

const getData = () => ({
  users: [...data.users],
  buzzes: [...data.buzzes].map(b => {
    const [ name, team ] = b.split('-')
    return { name, team }
  })
})

app.use(express.static('public'))
app.set('view engine', 'pug')

app.get('/', (req, res) => res.render('index', { title }))
app.get('/host', (req, res) => res.render('host', Object.assign({ title }, getData())))

function logUsers() {
  console.log("Current players : " + JSON.stringify([...data.users]))
}

io.on('connection', (socket) => {
  var userId;
  socket.on('join', (user) => {
    console.log(JSON.stringify(user) + " joined !")
    userId = user.id
    data.users.add(userId)
    io.emit('active', data.users.size)
    logUsers()
  })

  socket.on('buzz', (user) => {
    data.buzzes.add(`${user.name}-${user.team}`)
    io.emit('buzzes', [...data.buzzes])
    console.log(`${user.name} a buzzé !`)
  })

  socket.on('clear', () => {
    data.buzzes = new Set()
    io.emit('buzzes', [...data.buzzes])
    console.log(`Clear buzzes`)
  })

  socket.on('disconnect', function() {
    console.log(`${userId} disconnect ! `);
    data.users.delete(userId)
    io.emit('active', data.users.size)
    logUsers()
 });
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});