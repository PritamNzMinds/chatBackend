import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import dbCon from "./app/config/dbConnection.js";
import router from "./app/router/index.js";
import { Message } from "./app/model/message.model.js";
import { User } from "./app/model/user.model.js";

dotenv.config();

// database connection
dbCon();

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(cors());

// call router
app.use(router);

const io = new Server(server, {
  cors: { origin: "*" },
});

let users = [];

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);


  // add user
  socket.on("addUser", (data) => {
    if (!users.some((u) => u.id.toString() === data.id.toString())) {
      users.push({ ...data, socketId: socket.id });
    }
    io.emit("getUsers", users);
    // console.log("users", users);
  });

  socket.on("sendMessage", async (data) => {
    const { senderId, message, receiverId } = data;
    // save message to DB
    const newMessage = new Message({ senderId, message, receiverId });
    const newMsg = await newMessage.save();
    // find receiver from active users (not DB)
    const receiver = users.find((u) => u.id.toString() === receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", newMsg);
    } else {
      console.log("Receiver not found in  users list");
    }
  });

  // remove user on disconnect
  socket.on("disconnect", () => {
    users = users.filter((u) => u.socketId !== socket.id);
    io.emit("getUsers", users);
  });
});

const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
