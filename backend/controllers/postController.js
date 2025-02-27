import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import {v2 as cloudinary } from "cloudinary";

const createPost=async(req,res)=>{
  try {
    const {postedBy,text}=req.body;
    let {img}=req.body
    if(!postedBy ||!text){
      return res.status(400).json({error:"posted by and text fields are required"});

    }
    const user=await User.findById(postedBy);
    if(!user){
      return res.status(400).json({error:"user not found"});
    }
    if(user._id.toString()!==req.user._id.toString()){
      return res.status(400).json({error:"unauthorized user"});
    }
    const maxLength=500;
    if(text.length>maxLength){
      return res.status(400).json({error:`Text must be less then ${maxLength} character`})
    }
    if(img){
       const uploadResponse = await cloudinary.uploader.upload(img);
       img=uploadResponse.secure_url
    }
    const newPost=new Post({postedBy,text,img});
    await newPost.save();
    res.status(200).json(newPost);


    
  } catch (error) {
    res.status(501).json({ error: err.message });
		console.log("Error in updateUser: ", err.message);

     
    
  }

}
const getPost=async(req,res)=>{


  try {
    const post =await Post.findById(req.params.id);
    if(!post) return res.status(400).json({error:"post not found"});
    res.status(200).json(post);

    
  } catch (err) {
    res.status(500).json({ error: err.message });
		console.log("Error in get post: ", err.message);
    
  }
}
const deletePost=async(req,res)=>{

  
  try {
    
    const post =await Post.findById(req.params.id);
    if(!post) return res.status(400).json({error:"post not found"});
    if (post.postedBy.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to delete post" });
		}
    if(post.img){
       const imgId=post.img.split("/").pop().split(".")[0];
       await cloudinary.uploader.destroy(imgId);
    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({message:"post deleted successfully"});

    
  } catch (err) {
    res.status(500).json({ error: err.message });
		console.log("Error in get post: ", err.message);
    
  }
};

const likeunlikePost=async(req,res)=>{
      try {
        const {id:postId}=req.params;
        const userId=req.user._id;
        const post=await Post.findById(postId);
        if(!post){
          return res.status(404).json({error:"post not found"});

        }
        const userLikedPost=post.likes.includes(userId);
        if(userLikedPost){
              await Post.updateOne({_id:postId},{$pull:{likes:userId}})
              res.status(200).json({message:"post unliked succesfully"});
        }else{
          post.likes.push(userId);
          await post.save();
          res.status(200).json({message:"post liked successfully"});

        }
        
      } catch (err) {
        res.status(500).json({error:err.message});
       
        
      }
};
const replyToPost=async(req,res)=>{
    try {
      const {text}=req.body;
      const postId=req.params.id;
      const userId=req.user._id;
      const userProfile=req.user.profilePic;
      const username=req.user.username;
      if(!text){
        return res.status(400).json({error:"text field is required"});

      }
      const post=await Post.findById(postId);
      if(!post){
        return res.status(404).json({message:"post not found"});
      }
      const reply={userId,text,userProfile,username};
      post.replies.push(reply);
      await post.save();
      res.status(200).json(reply);

    } catch (err) {
      res.status(200).json({error:err.message});
      
    }
}

const getFeed=async(req,res)=>{

  try {
    const userId=req.user._id;
    const user=await User.findById(userId);
    if(!user){
      return res.status(404).json({error:"user not found"});
    }
    const following=user.following;
    const feedPosts=await Post.find({postedBy:{$in:following}}).sort({createdAt:-1});
    res.status(200).json(feedPosts);


  } catch (err) {
    res.status(500).json({error:err.message});
    
  }
}
const getUserPosts=async(req,res)=>{
  const {username}=req.params;

  try {
    const user=await User.findOne({username});
    if(!user){
      return res.status(404).json({error:"user not found"});    
    }
    const posts=await Post.find({postedBy:user._id}).sort({createdAt:-1});
    res.status(200).json({posts:posts});

  } catch (err) { 
    res.status(500).json({error:err.message});
    
  }
}
const bookmark=async(req,res)=>{
  try {
    const {id:postId}=req.params;
    const userId=req.user._id;
    const user=await User.findById(userId);
    if(!user){
      return res.status(404).json({error:"user not found"});
    }
    const post=await Post.findById(postId);
    if(!post){
      return res.status(404).json({error:"post not found"});
    }
    if(post.bookmarks.includes(userId)){
      await Post.updateOne({_id:postId},{$pull:{bookmarks:userId}});
      res.status(200).json({message:"post unbookmarked successfully"});
    }else{
      post.bookmarks.push(userId);
      await post.save();
      res.status(200).json({message:"post bookmarked successfully"});
    }
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}
export {createPost,getPost,deletePost,likeunlikePost,replyToPost,getFeed,getUserPosts,bookmark};