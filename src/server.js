import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine","pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_,res) => res.render("home"));
app.get("/*", (_,res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app); //creating a server from an express application
const wss = new WebSocket.Server({server}); //pasisng the server 
//running http & ws server together (NOT REQUIRED)
const sockets = [];

wss.on("connection",(socket)=>{
    sockets.push(socket);
    socket["nickname"] = "Anonymous";
    console.log("Connected to the Browser ✅");
    //socket = browser that connected
    socket.on("message",(msg) => {
        const message = JSON.parse(msg);
        switch (message.type) {
            case "new_message":
                sockets.forEach((aSocket)  => aSocket.send(`${socket.nickname}: ${message.payload}`));
                break;
            case "nickname":
                socket["nickname"] = message.payload
                break;
        }


        // if(message.type === "new_message"){
        //     sockets.forEach((aSocket)  => aSocket.send(message.payload));
        // } else if(message.type === "nickname"){
        //     console.log(message.payload);
        // }
    });
    socket.on("close",() => console.log("Disconnected from the Browser ❌"));
});

server.listen(3000,handleListen);