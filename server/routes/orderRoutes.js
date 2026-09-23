import express from "express";
import { Order } from "../models/order.model.js";
import Shop from "../models/shop.model.js";
import FoodItem from "../models/food.model.js";
import { sessionAuth as siteUserAuth } from "../middlewares/siteUserAuth.js";

const router = express.Router();

// POST: Place a new order (Supports both Guest and Authenticated Customers)
router.post("/", async (req, res) => {
  try {
    const {
      shopId,
      items,
      customerName,
      customerContact,
      customerEmail,
      serviceType,
      deliveryAddress,
      paymentMethod,
      specialNotes,
    } = req.body;

    if (!shopId) {
      return res.status(400).json({ error: "Shop ID is required." });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order must contain at least one item." });
    }

    if (!customerName || !customerName.trim()) {
      return res.status(400).json({ error: "Customer name is required." });
    }

    if (!customerContact || !customerContact.trim()) {
      return res.status(400).json({ error: "Contact phone number is required." });
    }

    // 1. Verify Shop is approved and open
    const shop = await Shop.findOne({ _id: shopId, status: "approved" }).lean();
    if (!shop) {
      return res.status(404).json({ error: "Business not found or not currently active." });
    }

    if (shop.operationalStatus && shop.operationalStatus !== "open") {
      return res.status(400).json({
        error: `This business is currently ${shop.operationalStatus.replace("_", " ")} and not accepting orders.`,
      });
    }

    // 2. Validate items & compute authoritative server-side pricing
    const validatedItems = [];
    let calculatedTotal = 0;

    for (const item of items) {
      const foodId = item.foodId || item.food || item._id;
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);

      const food = await FoodItem.findOne({ _id: foodId, shop: shop._id }).lean();
      if (!food) {
        return res.status(400).json({ error: `Dish '${item.name || foodId}' is no longer available.` });
      }

      if (food.availability && food.availability !== "available") {
        return res.status(400).json({
          error: `Sorry, '${food.name}' is currently ${food.availability.replace("_", " ")}.`,
        });
      }

      const activePrice =
        food.discountPrice && food.discountPrice > 0 ? food.discountPrice : food.price;

      validatedItems.push({
        food: food._id,
        name: food.name,
        price: activePrice,
        quantity,
      });

      calculatedTotal += activePrice * quantity;
    }

    // 3. Determine if customer is authenticated
    const siteuserId = req.session?.siteuserId || null;

    const newOrder = new Order({
      shop: shop._id,
      customer: siteuserId,
      customerName: customerName.trim(),
      customerContact: customerContact.trim(),
      customerEmail: customerEmail ? customerEmail.trim() : "",
      serviceType: ["dine_in", "takeaway", "delivery"].includes(serviceType) ? serviceType : "takeaway",
      deliveryAddress: deliveryAddress ? deliveryAddress.trim() : "",
      paymentMethod: paymentMethod || "cash_on_delivery",
      specialNotes: specialNotes ? specialNotes.trim() : "",
      items: validatedItems,
      totalAmount: calculatedTotal,
      status: "pending",
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order: {
        _id: newOrder._id,
        orderReference: newOrder.orderReference,
        shopName: shop.name,
        serviceType: newOrder.serviceType,
        totalAmount: newOrder.totalAmount,
        status: newOrder.status,
        createdAt: newOrder.createdAt,
        itemCount: newOrder.items.reduce((sum, it) => sum + it.quantity, 0),
        items: newOrder.items,
        isGuest: !siteuserId,
      },
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ error: "Unable to place the order. Please try again." });
  }
});

// GET: Authenticated Customer's orders
router.get("/my-orders", siteUserAuth, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.session.siteuserId })
      .populate("shop", "name location contact photo shopType")
      .sort({ createdAt: -1 })
      .lean();

    res.json(orders);
  } catch (error) {
    console.error("Fetch customer orders error:", error);
    res.status(500).json({ error: "Failed to retrieve your order history." });
  }
});

// GET: Lookup order by human-readable reference number
router.get("/ref/:reference", async (req, res) => {
  try {
    const { reference } = req.params;
    if (!reference) {
      return res.status(400).json({ error: "Order reference is required." });
    }

    const order = await Order.findOne({ orderReference: reference.trim().toUpperCase() })
      .populate("shop", "name location contact photo")
      .populate("items.food", "name picture")
      .lean();

    if (!order) {
      return res.status(404).json({ error: "Order not found with this reference number." });
    }

    res.json({
      orderReference: order.orderReference,
      status: order.status,
      serviceType: order.serviceType,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      shop: order.shop,
      items: order.items,
      deliveryAddress: order.deliveryAddress,
      isGuest: !order.customer,
    });
  } catch (error) {
    console.error("Lookup order by reference error:", error);
    res.status(500).json({ error: "Failed to retrieve order." });
  }
});

export default router;
