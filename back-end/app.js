const express = require('express');
const router = require('./src/routes/api');
const app = express();
require('dotenv').config();

// Security Middleware
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

// Middleware Setup
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// Rate Limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 3000 });
app.use(limiter);

// Routes
app.use("/api/v1", router);

// Catch-all 404
app.use("*", (req, res) => {
  res.status(404).json({ status: "Fail", data: "Not Found" });
});

module.exports = app;
