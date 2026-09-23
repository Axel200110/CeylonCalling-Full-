import express from "express";
import { RoomBooking } from "../models/booking.model.js";
import { Room } from "../models/room.model.js";
import Shop from "../models/shop.model.js";
import { sessionAuth as siteUserAuth } from "../middlewares/siteUserAuth.js";

const router = express.Router();

// POST: Reserve a room / stay (PUBLIC / SITEUSER)
router.post("/", async (req, res) => {
  try {
    const {
      shopId,
      roomId,
      customerName,
      customerEmail,
      customerPhone,
      checkInDate,
      checkOutDate,
      guestsCount,
      specialRequests,
    } = req.body;

    if (!shopId || !roomId) {
      return res.status(400).json({ error: "Shop and Room are required" });
    }

    if (!customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({ error: "Full contact details (Name, Email, Phone) are required" });
    }

    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({ error: "Check-in and Check-out dates are required" });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime()) || checkOut <= checkIn) {
      return res.status(400).json({ error: "Check-out date must be after check-in date" });
    }

    // Verify shop
    const shop = await Shop.findOne({ _id: shopId, status: "approved" });
    if (!shop) {
      return res.status(404).json({ error: "Venue not found or not approved" });
    }

    // Verify room
    const room = await Room.findOne({ _id: roomId, shop: shop._id });
    if (!room) {
      return res.status(404).json({ error: "Selected room listing not found" });
    }

    if (room.status === "maintenance") {
      return res.status(400).json({ error: "This room is currently under maintenance and cannot be booked." });
    }

    // Check for overlapping active bookings
    const overlapping = await RoomBooking.findOne({
      room: room._id,
      status: { $in: ["confirmed", "checked_in"] },
      $or: [
        { checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } },
      ],
    });

    if (overlapping) {
      return res.status(400).json({
        error: "This room is already reserved for the selected date range. Please select alternative dates.",
      });
    }

    // Calculate nights & price server-side
    const oneDay = 1000 * 60 * 60 * 24;
    const nights = Math.max(1, Math.ceil((checkOut - checkIn) / oneDay));
    const totalPrice = nights * room.pricePerNight;

    const siteuserId = req.session?.siteuserId || null;

    const booking = new RoomBooking({
      shop: shop._id,
      room: room._id,
      customer: siteuserId,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      customerPhone: customerPhone.trim(),
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guestsCount: guestsCount ? Math.min(Number(guestsCount), room.capacityGuests || 10) : 1,
      totalPrice,
      specialRequests: specialRequests ? specialRequests.trim() : "",
      status: "pending",
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: "Accommodation booking requested successfully!",
      booking,
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ error: error.message || "Failed to process booking." });
  }
});

// GET: Site user's bookings
router.get("/my-bookings", siteUserAuth, async (req, res) => {
  try {
    const bookings = await RoomBooking.find({ customer: req.session.siteuserId })
      .populate("shop", "name location photo contact")
      .populate("room", "name roomType bedType photos")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Lookup booking by reference
router.get("/ref/:reference", async (req, res) => {
  try {
    const booking = await RoomBooking.findOne({ bookingReference: req.params.reference })
      .populate("shop", "name location contact photo")
      .populate("room", "name roomType photos bedType facilities");

    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
