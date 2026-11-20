const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
    trim: true,
    minlength: 2,
    maxlength: 80
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 254,
    index: true
  },
  passwordHash: {
    type: String,
    required: true,
    select: false
  }
}, {
  timestamps: true,
  versionKey: false
});

userSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
