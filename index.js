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

  // socket.on("addUser", (userId) => {
  //   socket.join(userId);
  //   console.log(`User ${userId} joined their room`);
  // });

  // send message to specific user
  // socket.on("sendMessage", async (data) => {

  //   const {senderId,message,receiverId}=data;
  //   // save data in db
  //   const newMessage=new Message({senderId,message,receiverId});
  //   const newMsg=await newMessage.save();

  //   const users=await User.find({});
  //   const receiver = users.find((u) => u._id.toString() === receiverId);
  //   console.log(newMsg);
  //   if (receiver) {
  //     console.log(receiver);
  //     console.log("receiver",receiver);
  //     io.to(receiver._id.toString()).emit("getMessage",newMsg);
  //   }
  // });
  socket.on("sendMessage", async (data) => {
    const { senderId, message, receiverId } = data;

    // save message to DB
    const newMessage = new Message({ senderId, message, receiverId });
    const newMsg = await newMessage.save();
    // console.log(newMsg);
    // find receiver from active users (not DB)
    // console.log("receiver id", receiverId);
    const receiver = users.find((u) => u.id.toString() === receiverId);
    if (receiver) {
      // io.to(receiver.socketId).emit("getMessage", newMsg);
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
