const socket = io()
const body = document.querySelector('.js-body')
const form = document.querySelector('.js-join')
const joined = document.querySelector('.js-joined')
const buzzer = document.querySelector('.js-buzzer')
const joinedInfo = document.querySelector('.js-joined-info')
const editInfo = document.querySelector('.js-edit')
const usersInMayo = document.querySelector('.usersInMayo')
const usersInKetchup = document.querySelector('.usersInKetchup')
const active = document.querySelector('.js-active')

let user = {}

const getUserInfo = () => {
  user = JSON.parse(localStorage.getItem('user')) || {}
  return user
}
const saveUserInfo = () => {
  localStorage.setItem('user', JSON.stringify(user))
}

socket.on('active', (numberActive) => {
  if(numberActive == 0){
    active.innerText=`Aucun joueur`
  } else if(numberActive == 1){
    active.innerText=`1 joueur`
  } else if(numberActive > 1){
    active.innerText=`${numberActive} joueurs`
  } 
})

socket.on('usersInTeam', (data) => {
  usersInMayo.innerHTML = data.usersInMayo.map(user => `<li>${user.name}</li>`).join('')
  usersInKetchup.innerHTML = data.usersInKetchup.map(user => `<li>${user.name}</li>`).join('')
})

socket.on('disableBuzzer', () => {
  buzzer.removeAttribute('disabled');
})

socket.on('checkBuzzerAvailable', (buzzerAvailable) => {
  if(buzzerAvailable){
    buzzer.disabled = true
  } else {
    buzzer.removeAttribute('disabled');
  }
})


form.addEventListener('submit', (e) => {
  e.preventDefault()
  user.name = form.querySelector('[name=name]').value
  user.team = form.querySelector('[name="team"]:checked').value
  user.id = Math.floor(Math.random() * new Date()) + '_' + user.name
  socket.emit('join', user)
  saveUserInfo()
  joinedInfo.innerText = `${user.name} dans l'équipe ${user.team}`
  form.classList.add('hidden')
  joined.classList.remove('hidden')
  body.classList.add('buzzer-mode')
})

buzzer.addEventListener('click', (e) => {
  socket.emit('buzz', user)
  buzzer.disabled = true
})

editInfo.addEventListener('click', () => {
  joined.classList.add('hidden')
  form.classList.remove('hidden')
  body.classList.remove('buzzer-mode')
  socket.emit('changeTeam', getUserInfo())
})

socket.emit('updateUsersView')

