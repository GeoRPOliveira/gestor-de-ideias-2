import mongoose from "mongoose";

const ideaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: String, ref: "User" },
});

const Idea = mongoose.model("Idea", ideaSchema);
export default Idea;
