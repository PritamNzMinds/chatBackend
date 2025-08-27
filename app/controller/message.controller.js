import mongoose from "mongoose";
import { sendError, sendSuccess } from "../helper/response.js";
import { Message } from "../model/message.model.js";
import { User } from "../model/user.model.js";

export const getUsers = async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user.id } });

  let lastMessageList=[];
  for (const user of users){
    const lastMessage = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId:new mongoose.Types.ObjectId(req.user.id), receiverId:user._id },
            { senderId: user._id, receiverId: new mongoose.Types.ObjectId(req.user.id)},
          ],
        },
      },
      { $sort: { createdAt: -1 } }, 
      { $limit: 1 }, 
    ]);
    lastMessageList.push(lastMessage[0]);
}
  // console.log(lastMessageList);
  return sendSuccess(res, null, {users,lastMessageList}, 200);
};

export const getMessage = async (req, res) => {
  try {
    const id = req.params.id;
    const message = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId:new mongoose.Types.ObjectId(req.user.id), receiverId:new mongoose.Types.ObjectId(id) },
            { senderId: new mongoose.Types.ObjectId(id), receiverId: new mongoose.Types.ObjectId(req.user.id)},
          ],
        },
      },
      
    ]);
    // const message = await Message.find({
    //   $or: [
    //     { senderId: req.user.id, receiverId: id } || {
    //       senderId: id,
    //       receiverId: req.user.id,
    //     },
    //   ],
    // });
    return sendSuccess(res, null, message, 200);
  } catch (error) {
    console.log(error);
    sendError(res, "Internal server error", error.message, 500);
  }
};

export const lastMessage = async (req, res) => {
  try {
    const { receiverId } = req.body;
    if ( !receiverId) {
      sendError(res, "All fields are required", error.message, 400);
    }
    const lastMessage = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId:req.user.id, receiverId:receiverId },
            { senderId: receiverId, receiverId: req.user.id },
          ],
        },
      },
      { $sort: { createdAt: -1 } }, 
      { $limit: 1 }, 
    ]);
    return sendSuccess(res, null, lastMessage, 200);
  } catch (error) {
    console.log(error);
  }
};
