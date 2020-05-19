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

function filterTeam(users, team) {
  let result = users.filter(function (user) {
    return user.team === team;
  });
  console.log(team)
  console.log(result)
  return result;
}

getData = () => ({
  users: [...data.users],
  buzzes: [...data.buzzes].map(b => {
    const [name, team] = b.split('-')
    return { name, team }
  })
})

app.use(express.static('public'))
app.set('view engine', 'pug')

app.get('/', (req, res) => res.render('index', Object.assign({ title }, getData())))
app.get('/host', (req, res) => res.render('host', Object.assign({ title }, getData())))

function logUsers() {
  console.log("Current players : " + JSON.stringify([...data.users]))
}

function UpdateUsersView() {
  io.emit('active', data.users.size)
  io.emit('usersInTeam', { usersInMayo: filterTeam([...data.users], 'Mayo'), usersInKetchup: filterTeam([...data.users], 'Ketchup') })
}

io.on('connection', (socket) => {
  var userId;

  socket.on('join', (user) => {
    console.log(JSON.stringify(user) + " a rejoint !")
    userId = user.id
    data.users.add(user)
    UpdateUsersView()
    io.emit('checkBuzzerAvailable', [...data.buzzes].find(u => u === (user.name + '-' + user.team)))
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
    io.emit('disableBuzzer')
    console.log(`Clear buzzes`)
  })

  socket.on('updateUsersView', () => {
    UpdateUsersView()
  })

  // Custom event when the player change team
  socket.on('changeTeam', function (userSent) {
    console.log(`${userId} disconnect ! `);
    data.users.forEach(function (user) {
      if (user.id === userSent.id) {
        data.users.delete(user);
      }
    });
    UpdateUsersView()
    logUsers()
  });

  // Default event for refresh 
  socket.on('disconnect', function () {
    console.log(`${userId} disconnect ! `);
    data.users.forEach(function (user) {
      if (user.id === userId) {
        data.users.delete(user);
      }
    });
    UpdateUsersView()
    logUsers()
  });
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Our app is running on port ${PORT}`);
});