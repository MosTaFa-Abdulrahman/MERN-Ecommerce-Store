const router = require("express").Router();
const User = require("../models/User");
const mongoose = require("mongoose");
const { verifyUser, verifyAdmin } = require("../utils/protectedRoute");

// Get User By ((QUERY))
router.get("/get/:query", verifyUser, async (req, res) => {
  const { query } = req.params;
  try {
    let user;

    // query is userId
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query })
        .select("-password")
        .select("-updatedAt");
    } else {
      // query is username
      user = await User.findOne({ username: query })
        .select("-password")
        .select("-updatedAt");
    }

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all Users
router.get("/get", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update User
router.put("/update/:id", verifyUser, async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found 😥" });

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete User
router.delete("/delete/:id", verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(400).json({ error: "User not found 😥" });

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json("Deleted User Successfuly 😍");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
