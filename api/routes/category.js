const router = require("express").Router();
const Category = require("../models/Category");
const { verifyAdmin, verifyUser } = require("../utils/protectedRoute");

// Create Category
router.post("/create", verifyAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    const existCategory = await Category.findOne({ name });

    if (!name) {
      return res.status(400).json("Please Fill Category name 😊");
    } else if (existCategory) {
      return res.status(400).json("Already Created !!~~!! 😊");
    } else {
      const creatCategory = new Category({ name });
      await creatCategory.save();
      res.status(200).json(creatCategory);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Category
router.put("/update/:id", verifyAdmin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    !category && res.status(400).json({ error: "Category not found 😥" });

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Category
router.delete("/delete/:id", verifyAdmin, async (req, res) => {
  try {
    const user = await Category.findById(req.params.id);
    !user && res.status(400).json({ error: "Category not found 😥" });

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json("Deleted Category Successfuly 😍");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Categories
router.get("/get", verifyUser, async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Category
router.get("/get/:id", verifyAdmin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
