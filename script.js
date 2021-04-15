let userName;
let timeout;

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

setInterval(checkActive, 5000)

function getMessages() {
    const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages")

    promise.then(handleGetMessage)
    
}

function handleGetMessage(response){
    console.log(response.data)

    const feed = document.querySelector(".feed")
    const arr = response.data
    for(let i = 0; i < arr.length; i++){
        feed.innerHTML += `
        <li class="${arr[i].type}">
            <span class="timestamp">(${arr[i].time})</span><strong>${arr[i].from}</strong> para <strong>${arr[i].to}</strong>: ${arr[i].text}
        </li>
    `
    }

}
