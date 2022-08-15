import http from "http";
import SocketIO from "socket.io";
import express from "express";
import { doesNotMatch } from "assert";

const app = express();

app.set("view engine","pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_,res) => res.render("home"));
app.get("/*", (_,res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app); //creating a server from an express application
const wsServer = SocketIO(httpServer);

function publicRooms(){
    const {
        sockets: {
            adapter: {sids, rooms},
        },
    } =  wsServer;
    const publicRooms = [];
    rooms.forEach((_,key) => {
        if(sids.get(key) === undefined) {
            publicRooms.push(key);
        }
    });
    return publicRooms;
};

function countRoom(roomName){
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}


wsServer.on("connection", socket => {
    socket["nickname"] = "Anonymous"
    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`);
    });
    socket.on("enter_room", (roomName,done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
        wsServer.sockets.emit("room_change", publicRooms());
    });
    socket.on("disconnecting", (roomName) => {
        socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname, countRoom(roomName)-1));
    });
    socket.on("new_message", (msg,room,done) => {
        socket.to(room).emit("new_message", `${socket.nickname}:${msg}`);
        done();
    });
    socket.on("nickname", (nickname) =>(socket["nickname"] = nickname));

});

/* WebSocket

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

*/

httpServer.listen(3000,handleListen);