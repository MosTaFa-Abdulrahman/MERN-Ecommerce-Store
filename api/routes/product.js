const router = require("express").Router();
const Product = require("../models/Product");
const { verifyAdmin, verifyUser } = require("../utils/protectedRoute");
const { checkId } = require("../utils/checkId");

// Create
router.post("/create", verifyAdmin, async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.body;

    // Validation
    switch (true) {
      case !name:
        return res.status(400).json({ error: "Name is required" });
      case !brand:
        return res.status(400).json({ error: "Brand is required" });
      case !description:
        return res.status(400).json({ error: "Description is required" });
      case !price:
        return res.status(400).json({ error: "Price is required" });
      case !category:
        return res.status(400).json({ error: "Category is required" });
      case !quantity:
        return res.status(400).json({ error: "Quantity is required" });
    }

    const createProduct = new Product({ ...req.body });
    await createProduct.save(createProduct);
    res.status(200).json(createProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update
router.put("/update/:id", verifyAdmin, async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.body;

    // // Validation
    // switch (true) {
    //   case !name:
    //     return res.status(400).json({ error: "Name is required !!!" });
    //   case !brand:
    //     return res.status(400).json({ error: "Brand is required ~~!!" });
    //   case !description:
    //     return res.status(400).json({ error: "Description is required ~~" });
    //   case !price:
    //     return res.status(400).json({ error: "Price is required ~~~" });
    //   case !category:
    //     return res.status(400).json({ error: "Category is required ~~!!" });
    //   case !quantity:
    //     return res.status(400).json({ error: "Quantity is required ~~!" });
    // }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete
router.delete("/delete/:id", verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    !product && res.status(400).json({ error: "Product not found 😥" });

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Deleted Product Successfuly 😍");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Product
router.get("/get/:id", verifyUser, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    !product && res.status(400).json({ error: "Product not found 😥" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Products
router.get("/all/get", verifyUser, async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createAt: 1 });
    !products && res.status(400).json({ error: "All Products not found 😥" });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// router.get("/all/get", verifyUser, async (req, res) => {
//   try {
//     const products = await Product.find({})
//       .populate("category")
//       .limit(12)
//       .sort({ createAt: -1 });
//     !products && res.status(400).json({ error: "All Products not found 😥" });

//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Get 6 Products Dependent on ((((PageSize 😉))))
router.get("/pagesize/get", verifyUser, async (req, res) => {
  try {
    const pageSize = 6;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};
    const count = await Product.countDocuments({ ...keyword });

    const products = await Product.find({ ...keyword }).limit(pageSize);
    !products &&
      res.status(400).json({ error: "Page Size Products not found 😥" });

    res.status(200).json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Top Products focus 🧠
router.get("/top/get", verifyUser, async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    !products && res.status(400).json({ error: "Top Products not found 😥" });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get New Products focus 🧠
router.get("/new/get", verifyUser, async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    !products && res.status(400).json({ error: "New Products not found 😥" });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Review for Product
router.post("/add/review/:id", verifyUser, checkId, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400).json("Product Already Reviewd 🥱");
      } else {
        const review = {
          user: req.user._id,
          name: req.user.username,
          rating: Number(rating),
          comment,
        };

        product.reviews.push(review);

        product.numReviews = product.reviews.length;

        product.rating =
          product.reviews.reduce((acc, item) => item.rating + acc, 0) /
          product.reviews.length;

        await product.save();
        res.status(200).json("Review Added Success 🤩");
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Filterd Products
router.post("/filtered-products", async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
