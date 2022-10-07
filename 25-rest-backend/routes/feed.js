import express from "express";
import { body } from "express-validator";

import { getPosts, createPost } from "../controllers/feed.js";

const router = express.Router();

// GET /feed/posts
router.get("/posts", getPosts);

// POST /feed/posts
router.post(
  "/post",
  [
    body("title").trim().isLength({ min: 7 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  createPost
);

export default router;
