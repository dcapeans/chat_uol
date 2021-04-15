let userName;
let timeout;

function login() {
    console.log("login")
    userName = document.querySelector(".login input").value
    const response = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants", {name: userName})

    response.then(handleLoginSuccess)
    response.catch(handleLoginError)
}

function handleLoginSuccess() {
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