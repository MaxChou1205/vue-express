const express = require("express");
const _ = require("lodash");

const Profile = require("../../models/Profile");
const auth = require("../../middleware/auth");

const router = express.Router();

// add
router.post("/", auth, async (req, res) => {
  let profileFields = {};
  Object.keys(req.body).forEach(key => {
    if (req.body[key]) profileFields[key] = req.body[key];
  });

  let profile = new Profile(profileFields);
  await profile.save();

  res.send(profile);
});

// find all
router.get("/", auth, async (req, res) => {
  let profiles = await Profile.find();

  if (!profiles) return res.status(404).send("查無訊息");

  res.send(profiles);
});

// find specified one
router.get("/:id", auth, async (req, res) => {
  let profile = null;
  try {
    profile = await Profile.findById(req.params.id);
  } catch (err) {
    return res.status(400).send(err);
  }

  if (!profile) return res.status(404).send("查無訊息");

  res.send(profile);
});

// edit
router.put("/:id", auth, async (req, res) => {
  let profileFields = {};
  Object.keys(req.body).forEach(key => {
    if (req.body[key]) profileFields[key] = req.body[key];
  });

  try {
    const profile = await Profile.findByIdAndUpdate(
      req.params.id,
      profileFields,
      {
        new: true
      }
    );

    if (!profile) return res.status(404).send("此ID不存在");

    res.send(profile);
  } catch (err) {
    return res.status(400).send(err);
  }
});

// delete
router.delete("/:id", auth, async (req, res) => {
  const profile = await Profile.findByIdAndRemove(req.params.id);

  if (!profile) return res.status(404).send("此ID不存在");

  res.send(profile);
});

module.exports = router;
