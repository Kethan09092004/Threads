import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { bookmark, createPost } from "../controllers/postController.js";
import { getPost } from "../controllers/postController.js";
import { deletePost } from "../controllers/postController.js";
import { getUserPosts } from "../controllers/postController.js";
import { likeunlikePost } from "../controllers/postController.js";
import { replyToPost } from "../controllers/postController.js";
import { getFeed } from "../controllers/postController.js";
const router=express.Router();

router.get("/feed",protectRoute,getFeed);
router.post("/create",protectRoute,createPost);
router.get("/:id",getPost);
router.get("/user/:username",getUserPosts);
router.delete("/:id",protectRoute,deletePost);
router.put("/like/:id",protectRoute,likeunlikePost);
router.put("/reply/:id",protectRoute,replyToPost);
router.put("/bookmark/:id",protectRoute,bookmark);
export default router;