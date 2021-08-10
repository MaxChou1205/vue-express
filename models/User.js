const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { SecretOrKey: secret } = require("../config/keys");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  role: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

userSchema.methods.generateToken = function () {
  const token = jwt.sign(
    { id: this.id, name: this.name, avatar: this.avatar, role: this.role },
    secret
  );
  return token;
};

module.exports = mongoose.model("users", userSchema);
