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
  const title = req.body.title;
  const content = req.body.content;
  res.status(201).json({
    message: "Post created Successfully!",
    post: {
      _id: new Date().toISOString(),
      title,
      content,
      creator: { name: "Max" },
      createdAt: new Date(),
    },
  });
};

export { getPosts, createPost };
