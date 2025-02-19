// scripts/seedMLAs.js
const mongoose = require('mongoose');
const MLA = require('../models/MLA');
require('dotenv').config();

const mlaData = [
    {
        name: "himanta",
        state: "Assam",
        constituency: "Nagpur",
        party: "BJP",
        image: "himanta.jpg",
        rating: 4.2
    },
    {
        name: "Devendra Fadnavis",
        state: "Maharashtra",
        constituency: "Nagpur South West",
        party: "BJP",
        image: "devendra.jpeg",
        rating: 4.2
    },
    {
        name: "Uddhav Thackeray",
        state: "Maharashtra",
        constituency: "Bandra East",
        party: "Shiv Sena",
        image: "thackeray.jpg",
        rating: 3.9
    },
    {
        name: "Bhupendra Patel",
        state: "Gujarat",
        constituency: "Ghatlodia",
        party: "BJP",
        image: "patel.jpg",
        rating: 4.5
    },
    {
        name: "Vijay Rupani",
        state: "Gujarat",
        constituency: "Rajkot West",
        party: "BJP",
        image: "rupani.jpg",
        rating: 3.7
    },
    {
        name: "Siddaramaiah",
        state: "Karnataka",
        constituency: "Varuna",
        party: "Congress",
        image: "siddaramaiah.jpg",
        rating: 4.0
    },
    {
        name: "B. S. Yediyurappa",
        state: "Karnataka",
        constituency: "Shikaripura",
        party: "BJP",
        image: "yediyurappa.jpg",
        rating: 3.8
    },
    {
        name: "Devendra Fadnavis",
        state: "Maharashtra",
        constituency: "Nagpur South West",
        party: "BJP",
        image: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Devendra_Fadnavis_%40Vidhan_Sabha_04-03-2021.jpg",
        rating: 4.2
    },
];

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        await MLA.deleteMany({}); // Clear existing data
        await MLA.insertMany(mlaData);
        console.log('Sample MLA data inserted successfully');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });