const socket = io()
const active = document.querySelector('.js-active')
const buzzList = document.querySelector('.js-buzzes')
const clear = document.querySelector('.js-clear')

socket.on('active', (numberActive) => {
  if(numberActive == 0){
    active.innerText=`Aucun joueur`
  } else if(numberActive == 1){
    active.innerText=`1 joueur`
  } else if(numberActive > 1){
    active.innerText=`${numberActive} joueurs`
  } 
})

socket.on('buzzes', (buzzes) => {
  buzzList.innerHTML = buzzes
    .map(buzz => {
      const p = buzz.split('-')
      return { name: p[0], team: p[1] }
    })
    .map(user => `<li>${user.name} dans l'équipe ${user.team}</li>`)
    .join('')
})

clear.addEventListener('click', () => {
  socket.emit('clear')
})

