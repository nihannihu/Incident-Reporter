const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      index: '2dsphere' // Enables geospatial queries
    }
  },
  incidentType: {
    type: String,
    required: true,
    enum: [
      'traffic_jam',
      'road_closure',
      'waterlogging',
      'power_outage',
      'accident',
      'construction',
      'other'
    ]
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  address: {
    type: String,
    default: 'Unknown location'
  },
  weather: {
    temperature: Number,
    condition: String,
    humidity: Number
  },
  confirmations: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now,
    expires: 86400 // Auto-delete after 24 hours (86400 seconds)
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create geospatial index
incidentSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Incident', incidentSchema);
