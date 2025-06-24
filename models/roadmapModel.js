const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  title: {
    type: String,
    required: true
  },
  data: {
    type: Object, 
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model("Roadmap", roadmapSchema);
