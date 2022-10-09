import mongoose from "mongoose";

const Schema = mongoose.Schema;
const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageURL: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true } // mongoose will automatically add timestamps (createdAt & updatedAt) when a new doc is added
);

export default mongoose.model("Post", postSchema); // here collection name will be posts - note it's plural
