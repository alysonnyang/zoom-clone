const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nickname")
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`);
//creates a socket for the frontend allowing bi-directional communication with the server
//socket = connection to the server

socket.addEventListener("open",()=> {
    console.log("Connected to the Server ✅");
});

socket.addEventListener("message", (message)=>{
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
});

socket.addEventListener("close",()=> {
    console.log("Disconnected from the Server ❌");
});

function handleSubmit(event){
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(input.value);
    input.value = "";
}

function handleNickSubmit(event){
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(input.value);
}

messageForm.addEventListener("submit", handleSubmit)
nickForm.addEventListener("submit", handleNickSubmit)