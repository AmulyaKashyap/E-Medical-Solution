const socket = io()
let userName = document.querySelector('#username').textContent
let userId = document.querySelector('#userId').textContent
console.log(userId)

userName = userName.slice(9,)

let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')

// Recieve messages 
socket.on('message_send', (msg) => {
    appendMessage(msg, 'incoming')
    scrollToBottom()
})


textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        sendMessage(e.target.value)
    }
})

//let counter=0
function sendMessage(message) {
    let msg = {
        user: userName,
        id:userId,
        message: message.trim(),
        count:0
    }
    // Append 
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()

    // Send to server 
    socket.emit('message_send', msg)
 //   counter=msg.count
   // console.log(counter)
}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>`

    if(msg.count==5){
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

/*
function validate(evt) {
    var theEvent = evt || window.event;
  
    // Handle paste
    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
    // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /[0-9]|\./;
    if( !regex.test(key) ) {
      theEvent.returnValue = false;
      if(theEvent.preventDefault) theEvent.preventDefault();
    }
   // }
  }*/