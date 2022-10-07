import { validationResult } from "express-validator";

import Post from "../models/post.js";

const getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: Math.random().toString(),
        title: "First Post",
        content: "This is the content of my first post.",
        imageURL: "images/image-0.png",
        creator: {
          name: "Max",
        },
        createdAt: new Date(),
      },
      {
        _id: Math.random().toString(),
        title: "Second Post",
        content: "This is the content of my second post.",
        imageURL: "images/image-0.png",
        creator: {
          name: "Max",
        },
        createdAt: new Date(),
      },
    ],
  });
};

const createPost = (req, res, next) => {
  /**
   * Handling server side validation.
   */
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      message: "Validation Failed! Entered data is incorrect.",
      errors: errors.array(),
    });

    return;
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
    .catch((err) => console.log(err));
};

export { getPosts, createPost };
