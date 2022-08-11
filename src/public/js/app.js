const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");
const socket = new WebSocket(`ws://${window.location.host}`);
//creates a socket for the frontend allowing bi-directional communication with the server
//socket = connection to the server

socket.addEventListener("open",()=> {
    console.log("Connected to the Server ✅");
});

socket.addEventListener("message", (message)=>{
    console.log("New Message:",message.data);
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

messageForm.addEventListener("submit", handleSubmit)