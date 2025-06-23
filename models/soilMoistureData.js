// models/Prediction.js
const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    soilImage: { type: String, required: true }, // Original filename
    predictions: { type: Object, required: true }, // Crop recommendations
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prediction', predictionSchema);