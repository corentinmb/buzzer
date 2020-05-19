const socket = io()
const active = document.querySelector('.js-active')
const buzzList = document.querySelector('.js-buzzes')
const clear = document.querySelector('.js-clear')
const usersInMayo = document.querySelector('.usersInMayo')
const usersInKetchup = document.querySelector('.usersInKetchup')

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

socket.on('buzzes', (buzzes) => {
  buzzList.innerHTML = buzzes
    .map(buzz => {
      const p = buzz.split('-')
      return { name: p[0], team: p[1] }
    })
    .map(user => `<li class="buzzli">${user.name} de la team ${user.team}</li>`)
    .join('')
})

clear.addEventListener('click', () => {
  socket.emit('clear')
})

socket.emit('updateUsersView')
