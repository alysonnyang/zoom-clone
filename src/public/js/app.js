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


// setTimeout(()=> {
//     socket.send("hello from the browser!");
// }, 10000);

