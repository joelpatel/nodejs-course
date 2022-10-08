import mongoose from "mongoose";

const Schema = mongoose.Schema;
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  posts: [
    {
      type: Schema.Types.ObjectId, // objectid becuase this will be a reference to the post
      ref: "Post", // above reference to Post model
    },
  ],
});

export default mongoose.model("User", userSchema); // mongodb collection name: users
