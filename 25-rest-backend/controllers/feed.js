import { validationResult } from "express-validator";

import Post from "../models/post.js";

const getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json({ message: "Fetched posts successfully.", posts });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

/**
 * REST endpoint to GET a single post.
 * @param :postID - used to identify which post to GET
 */
const getPost = (req, res, next) => {
  const postID = req.params.postID;
  Post.findById(postID)
    .then((post) => {
      if (!post) {
        // no post was found
        const error = new Error("Post not found.");
        error.statusCode = 404;
        throw error; // here throw works because execution will goto the next catch block below which will execute the next() call
      }

      // post found
      res.status(200).json({ message: "Post fetched.", post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const createPost = (req, res, next) => {
  /**
   * Handling server side validation.
   */
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed! Entered data is incorrect.");
    error.statusCode = 422;
    error.errors = errors.array();
    throw error;
  }

  /**
   * Logic to add requested data to posts.
   * Also send a response indicating the
   * newly created post.
   */
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title,
    content,
    imageURL: "images/image-0.png",
    creator: { name: "Max" },
  });

  post
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Post created Successfully!",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500; // indicating server side error
      }
      next(err);
      /**
       * why not throw? because it's an async function so it won't go to next error handling function in chain
       * thats why we need to use next(). it'll cause the execution to go to the next error handling express middleware.
       */
    });
};

export { getPosts, createPost, getPost };
