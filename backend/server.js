const express = require('express');
require("dotenv").config();
const mongoose = require('mongoose');
const { Connect, isConnected } = require("./db");
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

const inventoryProductRoutes = require('./routes/inventoryProduct.routes')
const userRoutes = require('./routes/user.routes')
const gstinRoutes = require('./routes/gstin.routes')
const gstr1Routes = require('./routes/gstr1');
const posRoutes = require('./routes/posTransaction.routes')
const gst3BRoutes = require('./routes/gst3B.routes')

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

// Mongo DB Connection
Connect()
    .then(() => {
        console.log("Connected to MongoDB");
        // Start the server after successful connection
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server running on port ${process.env.PORT || 3000}`);
        });
    }).catch((error) => {
        console.error("Failed to connect to MongoDB:", error.message);
        process.exit(1);
    });

// Routes
app.use('/api/products', inventoryProductRoutes)
app.use('/api/auth', userRoutes)
app.use('/api', gstinRoutes)
app.use('/api/generate-gstr1', gstr1Routes);
app.use('/api/pos', posRoutes);
app.use('/api/gst', gst3BRoutes);


module.exports = app;
