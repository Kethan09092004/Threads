import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import {v2 as cloudinary} from "cloudinary";
import mongoose from "mongoose";
import Post from "../models/postModel.js";

const getUserProfile=async(req,res) => {
     const {query}=req.params;

     try {
      let user;
      if (mongoose.Types.ObjectId.isValid(query)){
        user=await User.findById({_id:query}).select("-password").select("-updateAt");
      }
      else{
        user=await User.findOne({username: query}).select("-password").select("-updateAt");
      }
      
      if(!user) return res.status(400).json({error:"User not found"});
      res.status(200).json(user);
     } catch (err) {
      res.status(500).json({error:err.message})
      console.log("error in userprofile:",err.message);
     }
};

const signUpUser=async(req,res)=>{
   try{
    
    const{name,email,username,password}=req.body;
    
    const user=await User.findOne({$or:[{email},{username}]});
    if(user){
      return res.status(400).json({error:"user already exist"});

    }
    const salt=await bcrypt.genSalt(18);
    const hashedpassword=await bcrypt.hash(password,salt);
    const newUser=new User({
      name,
      email,
      username,
      password:hashedpassword,
    });
    await newUser.save();
    if(newUser){
      res.status(201).json({
        _id:newUser._id,
        name:newUser.name,
        email:newUser.email,
        username:newUser.username,
      })
    }else{
      res.status(400).json({error:"Invalid user data"})
    }

   }catch(err){
    res.status(500).json({error:err.message})
    console.log("error in signUpuser;",err.message)
   }
};
const loginUser=async(req,res)=>{
  try{
       const {username,password}=req.body;
       const user=await User.findOne({username});
       const ispasswordCorrect=await bcrypt.compare(password,user?.password||"");
       if(!user ||!ispasswordCorrect) return res.status(400).json({error:"Invalid username or password"});
       if(user.isFrozen) 
      {
          user.isFrozen=false;
          await user.save();
        }
       
       generateTokenAndSetCookie(user._id,res);
       res.status(200).json({
        _id:user._id,
        name:user.name,
        email:user.email,
        username:user.username,
        bio:user.bio,
        profilepic:user.profilePic,
        active:user.active,
        bookmarks:user.bookmarks,
        isFrozen:user.isFrozen,
       });

  }
  catch(error){
    res.status(500).json({error:error.message});
    console.log("Error in loginUser:",error.message)
  }
};
const logout=async(req,res)=>{
     try{
      res.cookie("jwt","",{maxAge:1});
      res.status(200).json({message:"user logged out succesfully"})
     

     }
     catch(err){
        res.status(500).json({error:err.message})
        console.log("error in logout:",err.message);
     }
};

const followunfollowUser = async (req, res) => {
	try {
		const { id } = req.params;
		const userToModify = await User.findById(id);
		const currentUser = await User.findById(req.user._id);

		if (id === req.user._id.toString())
			return res.status(400).json({ error: "You cannot follow/unfollow yourself" });

		if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });

		const isFollowing = currentUser.following.includes(id);

		if (isFollowing) {
			// Unfollow user
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
			res.status(200).json({ message: "User unfollowed successfully" });
		} else {
			// Follow user
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
			res.status(200).json({ message: "User followed successfully" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in followUnFollowUser: ", err.message);
	}
};

const updateUser=async(req,res)=>{
  const {name,email,username,password,bio}=req.body;
  let {profilePic}=req.body;
    const userId=req.user._id;
   try {
      let user=await User.findById(userId);
      if(!user) return res.status(500).json({error:"user not found"});
      if(req.params.id!=userId.toString()){
        return res.status(400).json({error:"you cannot update others profile"});
      }
      if(password){
        const salt =await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)
         user.password=hashedPassword;
      }
      if(profilePic){
        if(user.profilePic){
          await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
        }
         const uploadResponse = await cloudinary.uploader.upload(profilePic);
         profilePic=uploadResponse.secure_url
      }
      user.name=name||user.name;
      user.username=username||user.username;
      user.email=email||user.email;
      user.profilePic=profilePic||user.profilePic;
      user.bio=bio||user.bio;

      user=await user.save();
      
      await Post.updateMany({"replies.userId":userId},

        {
          $set: {
            "replies.$[reply].userProfile":user.profilePic,
            "replies.$[reply].username":user.username
          },
        },
          {arrayFilters:[{"reply.userId":userId}]}
       
      );
      user.password=null;
      res.status(200).json(user);
      
    
   } catch (err) {
    res.status(500).json({ error: err.message });
		console.log("Error in updateUser: ", err.message);
   }
}

const getSuggestedUsers=async(req,res)=>{
   try {
    const userId=req.user._id;

    const userFollowedByYou=await User.findById(userId).select("following");
    const users=await User.aggregate([
      {
      $match:{
        _id:{$ne:userId},

      }
    },
    {
      $sample:{size:10}
    }
    ])
    const filteredUsers=users.filter(user=>!userFollowedByYou.following.includes(user._id));
    const suggestedUsers=filteredUsers.slice(0,4)

    suggestedUsers.forEach(user=>user.password=null);
    res.status(200).json(suggestedUsers);
    
    
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
}
const freezeAccount=async(req,res)=>{
  try {
    const user=await User.findById(req.user._id);
    if(!user){
      return res.status(400).json({error:"user not found"});
    }
    user.isFrozen=true;
    await user.save();
    res.status(200).json({success:true});
    
  } catch (error) {
       res.status(500).json({ error: error.message });
  } 
}


const bookmarkPost = async (req, res) => {
  try {
    const { pid } = req.params; // Destructure pid from req.params
    console.log("Post ID:", pid);

    const uid = req.user._id; // User ID from the authenticated request
    console.log("User ID:", uid);

    // Validate User ID
    const user = await User.findById(uid);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Validate Post ID and Convert to ObjectId
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ error: "Invalid Post ID" });
    }

    const post = await Post.findById(pid);
    if (!post) {
      return res.status(400).json({ error: "Post not found" });
    }

    // Check if post is already bookmarked
    if (user.bookmarks.includes(pid)) {
      return res.status(400).json({ error: "Post already bookmarked" });
    }

    // Add post to bookmarks
    user.bookmarks.push(pid);
    await user.save();

    res.status(200).json({ success: true, message: "Post bookmarked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteBookmark = async (req, res) => {
  try {
    const { pid } = req.params; // Destructure pid from req.params
    console.log("Post ID:", pid);

    const uid = req.user._id; // User ID from the authenticated request
    console.log("User ID:", uid);

    // Validate User ID and Convert to ObjectId
    if (!mongoose.Types.ObjectId.isValid(uid)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    // Validate Post ID and Convert to ObjectId
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ error: "Invalid Post ID" });
    }

    const user = await User.findById(uid);  
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const post = await Post.findById(pid);
    if (!post) {
      return res.status(400).json({ error: "Post not found" });
    } 

    // Check if post is already bookmarked    
    if (!user.bookmarks.includes(pid)) {
      return res.status(400).json({ error: "Post not bookmarked" });
    }

    // Remove post from bookmarks 
    user.bookmarks = user.bookmarks.filter((bookmark) => bookmark.toString() !== pid);
    await user.save();

    res.status(200).json({ success: true, message: "Post unbookmarked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getBookmarks = async (req, res) => {
  try {
    const uid = req.user._id; // User ID from the authenticated request

    // Validate User ID and Convert to ObjectId
    if (!mongoose.Types.ObjectId.isValid(uid)) {
      return res.status(400).json({ error: "Invalid User ID" });    
    }

    const user = await User.findById(uid);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const bookmarks = await Post.find({ _id: { $in: user.bookmarks } });

    res.status(200).json(bookmarks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getallUsers=async(req,res)=>{
  try {
    const users=await User.find({}).select("-password").select("-updateAt");
    res.status(200).json({users});
    
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
}
const activeUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    user.active = true;
    await user.save();
    res.status(200).json({ success: true, message: "User activated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    user.active = false;
    await user.save();
    res.status(200).json({ success: true, message: "User deactivated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}



export {signUpUser,loginUser,logout,followunfollowUser,updateUser,getUserProfile,getSuggestedUsers,freezeAccount,bookmarkPost,deleteBookmark,getBookmarks,getallUsers,deactivateUser,activeUser};
