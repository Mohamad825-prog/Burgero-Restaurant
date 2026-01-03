const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../db");

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/specials");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Add new special item
router.post("/", upload.single("image"), (req, res) => {
    const { name, description, price } = req.body;
    const image = req.file.filename;

    const sql =
        "INSERT INTO special_items (name, description, price, image) VALUES (?, ?, ?, ?)";

    db.query(sql, [name, description, price, image], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Special item added successfully" });
    });
});

// Get all specials
router.get("/", (req, res) => {
    db.query("SELECT * FROM special_items", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

module.exports = router;
