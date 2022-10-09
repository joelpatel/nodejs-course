import express from "express";
import { body } from "express-validator";

import {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/feed.js";
import isAuth from "../middleware/is-auth.js";

const router = express.Router();

// GET /feed/posts
router.get("/posts", isAuth, getPosts);

// POST /feed/post
router.post(
  "/post",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  createPost
);

// GET /feed/post/:postID
router.get("/post/:postID", getPost);

// PUT /feed/post/:postID
router.put(
  "/post/:postID",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  updatePost
);
/**
 * put, post, patch requests can have req body
 * Here put has param and it will also have a request body
 */

router.delete("/post/:postID", deletePost);

export default router;
