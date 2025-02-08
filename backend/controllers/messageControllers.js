
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getRecipientSocketid } from "../socket/socket.js";
import { io } from "../socket/socket.js";
import { v2 as cloudinary } from "cloudinary";
/**
 * Send a new message.
 */
async function sendMessage(req, res) {
  try {
    const { recipientId, message } = req.body;
    
    let { img }=req.body;
    // Validate input
    // if (!recipientId || !message) {
    //   return res.status(400).json({ recipientId });
    // }

    const senderId = req.user._id; // Extract sender ID from the authenticated user

    if (senderId.toString() === recipientId) {
      return res.status(400).json({ error: "Sender and recipient cannot be the same user." });
    }

    // Find or create a conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId],
        lastMessage: { text: message, sender: senderId },
      });
      await conversation.save();
    }
    if(img){
      const uploadResponse = await cloudinary.uploader.upload(img);
      img=uploadResponse.secure_url;
    }

    // Create and save the new message
    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: message,
      img: img||"",
    });

    await Promise.all([
      newMessage.save(),
      conversation.updateOne({
        lastMessage: { text: message, sender: senderId },
      }),
    ]);
    const recipientSocketId =getRecipientSocketid(recipientId);
    io.to(recipientSocketId).emit("newMessage", newMessage);

    res.status(200).json({newMessage});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Get all messages between two users.
 */
/**
 * Get all messages between two users.
 */
async function getMessages(req, res) {
  const { otherUserId } = req.params;
  const userId = req.user._id; 

  try {
    if (!otherUserId) {
      return res.status(400).json({ error: "Other user ID is required." });
    }

    // Find the conversation between the users
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found." });
    }

    // Retrieve all messages in the conversation
    const messages = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 }) // Sort by creation time in ascending order
      .lean(); // Convert MongoDB documents to plain JavaScript objects for better performance

    res.status(200).json( messages );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}



async function getConversations(req,res){
  const userId=req.user._id;
   try {
    const conversations=await Conversation.find({participants:userId}).populate({
      path:"participants",
      select:"username profilePic",

    });
    conversations.forEach(conversation=>{
      conversation.participants=conversation.participants.filter(participant=>participant._id.toString()!==userId.toString())
    });
    res.status(200).json(conversations);

    
   } catch (error) {
       res.status(500).json({error:error.message});
   }
}
export { sendMessage, getMessages,getConversations };
