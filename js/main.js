let chatMessageTextBox = document.getElementById("chatMessageTextBox")
let sendMessageButton = document.getElementById("sendMessageButton")
let chatMessageList = document.getElementById("chatMessageList")
let id = document.getElementById("idTextBox").value
let userCount = document.getElementById("userCount")
let socket = io()

sendMessageButton.addEventListener('click', function() {
  let message = chatMessageTextBox.value
  let data = {id: id, message: message}
  socket.emit('trips', data)
})

socket.on('newChat', (data) => {
  console.log(data.chatHistory)
  let userCountLI = `<li>Current Users in Chat: ${data.users}</li>`
  userCount.innerHTML = userCountLI
  let chatMessageLI = data.chatHistory.map((chat)=>{
    return `<li>${chat.id}: ${chat.message}</li>`
  })
  chatMessageList.innerHTML = chatMessageLI.join('')
})

socket.on('trips', (data) =>{
  let userCountLI = `<li>Current Users in Chat: ${data.users}</li>`
  userCount.innerHTML = userCountLI
  let newChatMessageLI = `<li>${data.data.id}: ${data.data.message}</li>`
  chatMessageList.insertAdjacentHTML('beforeend', newChatMessageLI)
})
