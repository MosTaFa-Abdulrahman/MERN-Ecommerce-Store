const router = require("express").Router();
const { verifyUser, verifyAdmin } = require("../utils/protectedRoute");
const Product = require("../models/Product");
const Order = require("../models/Order");

// Utility Function
const calcPrices = (orderItems) => {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = (itemsPrice * taxRate).toFixed(2);

  const totalPrice = (
    itemsPrice +
    shippingPrice +
    parseFloat(taxPrice)
  ).toFixed(2);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
};

// Create Order
router.post("/create", verifyUser, async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json("No order items");
    }

    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );

      if (!matchingItemFromDB) {
        res.status(404);
        throw new Error(`Product not found: ${itemFromClient._id}`);
      }

      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(200).json(createdOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Orders
router.get("/all/get", verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id username");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User Order
router.get("/mine/get", verifyUser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Count Total Orders
router.get("/total-orders", async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.status(200).json(totalOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calculate Total Sales
router.get("/total-sales", async (req, res) => {
  try {
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    res.status(200).json(totalSales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calculate Total Sales By (((Date)))
router.get("/total-sales-by-date", async (req, res) => {
  try {
    const salesByDate = await Order.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
          },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    res.status(200).json(salesByDate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Order By ((ID))
router.get("/get/:id", verifyUser, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "username email"
    );

    if (order) {
      res.status(200).json(order);
    } else {
      res.status(400);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Make Order As Paid
router.put("/pay/:id", verifyUser, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address, // error in payer
      };
      const updateOrder = await order.save();
      res.status(200).json(updateOrder);
    } else {
      res.status(400);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark Order As Deliverd
router.put("/deliver/:id", verifyAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.status(200).json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found 😥");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
