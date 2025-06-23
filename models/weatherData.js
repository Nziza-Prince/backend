// models/WeatherData.js
const mongoose = require('mongoose');

const weatherDataSchema = new mongoose.Schema({
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    location: {
        lat: { type: Number, required: true },
        lon: { type: Number, required: true }
    },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    windSpeed: { type: Number, required: true },
    precipitation: { type: Number, default: 0 },
    cloudCover: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now },
    source: { type: String, default: 'OpenWeatherMap' } // or Open-Meteo
});

module.exports = mongoose.model('WeatherData', weatherDataSchema);