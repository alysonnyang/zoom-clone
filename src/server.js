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

wss.on("connection",(socket)=>{
    console.log("Connected to the Browser ✅");
    //socket = browser that connected
    socket.on("close",() => console.log("Disconnected from the Browser ❌"));
    
    socket.send("hello!!!");
})

server.listen(3000,handleListen);

//app.listen(3000, handleListen);