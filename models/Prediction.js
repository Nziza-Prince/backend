const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true, unique: true },
    soilImage: { type: String, required: true },
    predictions: { type: Object, required: true },
    timestamp: { type: Date, default: Date.now }
});

// ✅ Correct export (prevents overwrite issues in dev)
const Prediction = mongoose.models.Prediction || mongoose.model('Prediction', predictionSchema);

module.exports = Prediction;
