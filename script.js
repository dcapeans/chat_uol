let userName;
let timeout;

setInterval(checkActive, 5000)


function login() {
    userName = document.querySelector(".login input").value
    const response = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants", {name: userName})
    response.then(handleLoginSuccess)
    response.catch(handleLoginError)
}

function handleLoginSuccess() {
    getMessages()
    const loginScreen = document.querySelector(".login")
    loginScreen.classList.add("hidden")
    clearInterval(timeout)
    setInterval(getMessages, 3000)
}

function handleLoginError(error) {
    if(error.response.status === 400){
        alert("Esse nome já existe. Tente um nome diferente!")
    } else {
        alert("Um erro inesperado ocorreu. Tente novamente.")
    }
    timeout = setTimeout(login, 10000)
}

function checkActive() {
    if(userName !== undefined) {
        axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status", {name: userName})
    }
}

function getMessages() {
    const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages")
    promise.then(handleGetMessage) 
}

function handleGetMessage(response){
    const arr = response.data
    renderMessage(arr)
    autoScroller()
}

function renderMessage(arr) {
    const feed = document.querySelector(".feed")
    feed.innerHTML = "";
    for(let i = 0; i < arr.length; i++){
        feed.innerHTML += `
        <li class="${arr[i].type}">
            <span class="timestamp">(${arr[i].time})</span>&nbsp<strong>${arr[i].from}</strong>&nbsppara&nbsp<strong>${arr[i].to}</strong>: ${arr[i].text}
        </li>
    `
    }
}

function autoScroller() {
    const allMessage = document.querySelectorAll("li")
    const lastMessage = allMessage[allMessage.length - 1]
    lastMessage.scrollIntoView()
}

function formListenerInit() {
    const form = document.querySelector(".send_message_form")
    
    form.addEventListener("submit", function(event){
        event.preventDefault();
        const messageText = form.querySelector("[name=message]").value
        const messageObj = {
            from: userName,
            to: "Todos",
            text: messageText,
            type: "message"
        }
        const request = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages", messageObj)
        request.catch(window.location.reload())
        form.reset()

        return false
    })
    
}

formListenerInit()

