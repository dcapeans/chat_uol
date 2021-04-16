let receiverUsers = document.querySelectorAll("[name=receiverUser]") 
const messageType = document.querySelectorAll(".message_type li")
selectedReceiverUser = "Todos"
selectedMessageType = "message"
let userName;
let timeout;

formListenerInit()
loginListenerInit()
userListListenerInit()
setInterval(checkActive, 5000)
setInterval(getUserList, 10000)

function loginListenerInit() {
    const form = document.querySelector(".login_form")

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        userName = form.querySelector("[name=username]").value
        const response = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants", {name: userName})
        response.then(handleLoginSuccess)
        response.catch(handleLoginError)
        form.reset()
        return false
    })
}

function handleLoginSuccess() {
    getMessages()
    const loginScreen = document.querySelector(".login")
    loginScreen.classList.add("hidden")
    clearInterval(timeout)
    setInterval(getMessages, 3000)
    getUserList()
    
}

function handleLoginError(error) {
    if (error.response.status === 400) {
        alert("Esse nome já existe. Tente um nome diferente!")
    } else {
        alert("Um erro inesperado ocorreu. Tente novamente.")
    }
    timeout = setTimeout(login, 10000)
}

function checkActive() {
    if (userName !== undefined) {
        axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status", {
            name: userName
        })
    }
}

function getMessages() {
    const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages")
    promise.then(handleGetMessage)
}

function handleGetMessage(response) {
    const arr = response.data
    renderMessage(arr)
    autoScroller()
}

function renderMessage(arr) {
    const feed = document.querySelector(".feed")
    feed.innerHTML = "";
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].type === "private_message" && (arr[i].to === selectedReceiverUser || arr[i].from === userName)) {
            feed.innerHTML += `
                <li class="${arr[i].type}">
                    <p><span class="timestamp">(${arr[i].time})</span>&nbsp<strong>${arr[i].from}</strong>&nbsppara&nbsp<strong>${arr[i].to}</strong>: ${arr[i].text}</p>
                </li>
            `
        } else if (arr[i].type !== "private_message") {
            feed.innerHTML += `
                <li class="${arr[i].type}">
                    <p><span class="timestamp">(${arr[i].time})</span>&nbsp<strong>${arr[i].from}</strong>&nbsppara&nbsp<strong>${arr[i].to}</strong>: ${arr[i].text}</p>
                </li>
            `
        }
    }
}

function autoScroller() {
    const allMessage = document.querySelectorAll("li")
    const lastMessage = allMessage[allMessage.length - 1]
    lastMessage.scrollIntoView()
}

function formListenerInit() {
    const form = document.querySelector(".send_message_form")

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const messageText = form.querySelector("[name=message]").value
        const messageObj = {
            from: userName,
            to: selectedReceiverUser,
            text: messageText,
            type: selectedMessageType
        }
        const request = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages", messageObj)
        request.catch(window.location.reload)
        form.reset()
        return false
    })
}

function userListListenerInit() {
    const userButton = document.querySelector("[name=user_list_button]")
    const darkBackground = document.querySelector(".dark_background")
    
    userButton.addEventListener("click", function(event){
        const userListWindow = document.querySelector(".user_list")
        userListWindow.classList.remove("hidden")
    })

    darkBackground.addEventListener("click", function(event){
        const userListWindow = document.querySelector(".user_list")
        userListWindow.classList.add("hidden")
    })
}

function selectUserListenerInit(selectionList, selector) {
    for(let i = 0; i < selectionList.length; i++){
        selectionList[i].addEventListener("click", function(){
            const activeUser = document.querySelectorAll(selector + " .selected")
            const activeMessageType = document.querySelectorAll(selector + " .selected")

            if(activeUser.length > 0) {
                activeUser[0].classList.remove("selected")
            }
            if(activeMessageType.length > 0) {
                activeMessageType[0].classList.remove("selected")
            }

            selectionList[i].classList.add("selected")
            handleDestinationMessage()
        })
    } 
}

function getUserList() {
    const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants")
    promise.then(handleGetUsers)
}

function handleGetUsers(response) {
    const arr = response.data
    renderUserList(arr)
    receiverUser = document.querySelectorAll("[name=receiverUser]")
}

function renderUserList(arr) {
    const userList = document.querySelector(".user_names ul")
    userList.innerHTML = `
        <li name="receiverUser" class="selected">
            <ion-icon name="people"></ion-icon>
                Todos
            <ion-icon name="checkmark-sharp"></ion-icon>
        </li>
    `
    for(let i = 0; i < arr.length; i++){
        userList.innerHTML += `
        <li name="receiverUser">
            <ion-icon name="people"></ion-icon>
                ${arr[i].name}
            <ion-icon name="checkmark-sharp"></ion-icon>
        </li>
    `
    }
    receiverUsers = document.querySelectorAll("[name=receiverUser]") 
    selectUserListenerInit(receiverUsers, ".user_names")
    selectUserListenerInit(messageType, ".message_type")
}

function handleDestinationMessage(){
    selectedReceiverUser = document.querySelector(".user_names .selected")
    const MessageType = document.querySelector(".message_type .selected").innerText
    if(MessageType === "Público"){
        selectedMessageType = "message"
    } else {
        selectedMessageType = "private_message"
    }
    const destinyMessage = document.querySelector("footer p")
    destinyMessage.innerHTML = `Enviando para ${selectedReceiverUser.innerText} (${MessageType})`
}