const getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      { title: "First Post", content: "This is the content of my first post." },
      {
        title: "Second Post",
        content: "This is the content of my second post.",
      },
    ],
  });
};

const createPost = (req, res, next) => {
  console.log(req.body);
  const title = req.body.title;
  const content = req.body.content;
  res.status(201).json({
    message: "Post created Successfully!",
    post: { id: new Date().toISOString(), title, content },
  });
};

export { getPosts, createPost };
