const socket = io()
let userName = document.querySelector('#username').textContent

userName = userName.slice(9,)

let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')

// Recieve messages 
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming')
    scrollToBottom()
})


textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        sendMessage(e.target.value)
    }
})

function sendMessage(message) {
    let msg = {
        user: userName,
        message: message.trim(),
        count:0
    }
    // Append 
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()

    // Send to server 
    socket.emit('message', msg)

}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>`

    if(msg.count==3){
        markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
        <a href="/doctors/list" class="btn btn-small">Consult Now</a>`
        document.querySelector('#text').innerHTML = "";
    }
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
}


function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}



