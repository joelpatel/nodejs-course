import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { validationResult } from "express-validator";

import Post from "../models/post.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
   * Check if file was provided or not.
   */
  if (!req.file) {
    const error = new Error("No image provided.");
    error.statusCode = 422;
    throw error;
  }

  /**
   * Logic to add requested data to posts.
   * Also send a response indicating the
   * newly created post.
   */
  const imageURL = req.file.path;
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title,
    content,
    imageURL,
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

const updatePost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(
      "Validation failed. Please enter all required data."
    );
    error.statusCode = 422;
    error.errors = errors.array();
    throw error;
  }

  const postID = req.params.postID;
  const title = req.body.title;
  const content = req.body.content;

  /**
   * default value will be previous image
   * but if user wants to change image,
   * then they can change the file and
   * file.path will be set
   */
  let imageURL = req.body.image;
  if (req.file) {
    imageURL = req.file.path;
  }
  if (!imageURL) {
    const error = new Error("No file provided.");
    error.statusCode = 422;
    throw error;
  }

  Post.findById(postID)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find the requested post.");
        error.statusCode = 404;
        throw error;
      }

      /**
       * checking if the image provided is different
       * if its different then delete old image
       */
      if (imageURL !== post.imageURL) {
        clearImage(post.imageURL);
      }

      // update the post
      post.title = title;
      post.content = content;
      post.imageURL = imageURL;

      return post.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "Post updated successfully.",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => {
    if (err) console.log(err);
  });
};

const deletePost = (req, res, next) => {
  const postID = req.params.postID;
  /**
   * Reason for using Post.findById instead of Post.findByIdAndRemove
   * is because we would want to verify whether the post was created
   * by the same user who is requesting the deletion of the post.
   */
  Post.findById(postID)
    .then((post) => {
      if (!post) {
        const error = new Error("Requested post does not exist.");
        error.statusCode = 404;
        throw error;
      }

      // Check logged in user.
      clearImage(post.imageURL);
      return Post.findByIdAndRemove(postID);
    })
    .then((result) => {
      res.status(200).json({
        message: "Post deleted successfully.",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export { getPosts, createPost, getPost, updatePost, deletePost };
