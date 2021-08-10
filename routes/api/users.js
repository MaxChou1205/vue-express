const express = require("express");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const _ = require("lodash");

const User = require("../../models/User");
const auth = require("../../middleware/auth");

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ msg: "test123" });
});

router.post("/register", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("此帳號已註冊");

  const avatar = gravatar.url(req.body.email, { s: "200", r: "pg", d: "mm" });

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    avatar,
    role: req.body.role
  });

  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);

  await newUser.save();

  res.send(_.pick(newUser, ["_id", "name", "email", "avatar", "role", "date"]));
});

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  let user = await User.findOne({ email });
  if (!user) return res.status(404).send("查無此帳號");

  isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) return res.status(403).send("密碼錯誤");

  // const rule = { id: user.id, email: user.email };
  // let token = jwt.sign(rule, secret, { expiresIn: 60 * 60 });
  const token = user.generateToken();
  return res.header("x-auth-token", token).json({ message: "success", token });
});

router.get("/me", auth, async (req, res) => {
  res.send(req.user);
});

module.exports = router;
