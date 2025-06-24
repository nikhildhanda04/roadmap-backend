const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please add a Username"]
    },
    email: {
        type: String,
        required: [true, "Please Add a EmailId"],
        unique: [true, "Email Address is already in use"]
    },
    password: {
        type: String,
        required: [true, "Please add a password"]
    },
}, {
    timestamps: true
})

module.exports = mongoose.model("User", userSchema )