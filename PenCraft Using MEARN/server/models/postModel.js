const { Schema, model } = require("mongoose");

const postSchema = new Schema({
    title: { type: String, required: true },
    category: { type: String, enum: ["Agriculture", "Business", "Education", "Entertainment", "Art", "Investment", 
    "Uncategorized", "Weather"], message: "{VALUE} is not supported" },
    description: { type: String }, 
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
    thumbnail: { type: String, required: true },

}, { timestamps: true });

const Post = model("Post", postSchema);

module.exports = Post;
