import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { validationResult } from "express-validator";

import Post from "../models/post.js";
import User from "../models/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;

  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    res.status(200).json({
      message: "Fetched posts successfully.",
      posts,
      totalItems: totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

/**
 * REST endpoint to GET a single post.
 * @param :postID - used to identify which post to GET
 */
const getPost = async (req, res, next) => {
  const postID = req.params.postID;
  try {
    const post = await Post.findById(postID);
    if (!post) {
      // no post was found
      const error = new Error("Post not found.");
      error.statusCode = 404;
      throw error; // here throw works because execution will goto the next catch block below which will execute the next() call
    }

    // post found
    res.status(200).json({ message: "Post fetched.", post });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const createPost = async (req, res, next) => {
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
    creator: req.userIDFromJWTToken,
  });

  try {
    const savedPost = await post.save();

    const user = await User.findById(req.userIDFromJWTToken);
    if (savedPost._id) {
      user.posts.push(savedPost._id); // we are providing the postID for faster execution
    } else {
      user.posts.push(post); // letting mongoose do the heavy lifting in figuring out the post id
    }
    const updatedUser = user.save();
    res.status(201).json({
      message: "Post created Successfully!",
      post: savedPost,
      creator: { _id: user._id, name: user.name },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500; // indicating server side error
    }
    next(err);
    /**
     * why not throw? because it's an async function so it won't go to next error handling function in chain
     * thats why we need to use next(). it'll cause the execution to go to the next error handling express middleware.
     */
  }
};

const updatePost = async (req, res, next) => {
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

  try {
    const post = await Post.findById(postID);
    if (!post) {
      const error = new Error("Could not find the requested post.");
      error.statusCode = 404;
      throw error;
    }

    /**
     * Check if the creator of the post
     * is the one requesting the updation
     * of this post.
     */
    if (post.creator.toString() !== req.userIDFromJWTToken) {
      const err = new Error("Not authorized!");
      err.statusCode = 403;
      throw err;
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

    const result = await post.save();

    res.status(200).json({
      message: "Post updated successfully.",
      post: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => {
    if (err) console.log(err);
  });
};

const deletePost = async (req, res, next) => {
  const postID = req.params.postID;
  /**
   * Reason for using Post.findById instead of Post.findByIdAndRemove
   * is because we would want to verify whether the post was created
   * by the same user who is requesting the deletion of the post.
   */
  try {
    const post = await Post.findById(postID);
    if (!post) {
      const error = new Error("Requested post does not exist.");
      error.statusCode = 404;
      throw error;
    }

    /**
     * Check if the creator of the post
     * is the one requesting the deletion
     * of this post.
     */
    if (post.creator.toString() !== req.userIDFromJWTToken) {
      const err = new Error("Not authorized!");
      err.statusCode = 403;
      throw err;
    }

    clearImage(post.imageURL);

    const resultOfPostDeletion = await Post.findByIdAndRemove(postID);
    const user = await User.findById(req.userIDFromJWTToken);

    user.posts.pull(postID); // pull method is of mongoose not built in arrays
    await user.save();

    res.status(200).json({
      message: "Post deleted successfully.",
      post: resultOfPostDeletion,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export { getPosts, createPost, getPost, updatePost, deletePost };
