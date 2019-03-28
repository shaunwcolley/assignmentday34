let chatMessageTextBox = document.getElementById("chatMessageTextBox")
let sendMessageButton = document.getElementById("sendMessageButton")
let chatMessageList = document.getElementById("chatMessageList")

let socket = io()

sendMessageButton.addEventListener('click', function() {
  let message = chatMessageTextBox.value
  socket.emit('trips', message)
})

socket.on('trips', (chatter) =>{
  let chatMessageLI = `<li>${chatter.name}: ${chatter.data}</li>`
  chatMessageList.insertAdjacentHTML('beforeend', chatMessageLI)
})
