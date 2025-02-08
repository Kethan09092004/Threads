import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import {  bookmarkPost, deactivateUser, deleteBookmark, freezeAccount, getallUsers, getBookmarks, getSuggestedUsers, signUpUser } from "../controllers/userController.js";
import { activeUser } from "../controllers/userController.js";
import { loginUser } from "../controllers/userController.js";
import { logout } from "../controllers/userController.js";
import { followunfollowUser } from "../controllers/userController.js";
import { updateUser } from "../controllers/userController.js";
import { getUserProfile } from "../controllers/userController.js";
const router=express.Router();
router.get("/suggested",protectRoute,getSuggestedUsers);
router.get("/profile/:query",getUserProfile);
router.post("/signUp",signUpUser);
router.post("/login",loginUser);
router.post("/logout",logout);
router.post("/follow/:id",protectRoute,followunfollowUser)
router.put("/update/:id",protectRoute,updateUser);
router.put("/freeze",protectRoute,freezeAccount);
router.put("/bookmark/:pid",protectRoute,bookmarkPost);
router.delete("/unbookmark/:pid",protectRoute,deleteBookmark);
router.get("/getbookmarks",protectRoute,getBookmarks);
router.get("/getallUsers",protectRoute,getallUsers);
router.put("/activate/:id",protectRoute,activeUser);
router.put("/deactivate/:id",protectRoute,deactivateUser);
  
  














export default router;