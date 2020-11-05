const mongoose = require('mongoose')
const ids = require('short-id');

const linkSchema = new mongoose.Schema({
  name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
  },
  clicks: {
    type: Number,
    required: true,
    default: 0
  },
  full: [{
      url: {
        type: String,
        required: [true, 'URL is required']
      },
      perc: {
        type: Number,
        required: [true, 'Percentage value is required'],
        default: 0
      },
      visits: {
        type: Number,
        default: 0
      }
  }],
  short: {
    type: String,
    required: true,
    default: ids.generate 
  },
  isArchive: {
    type: Boolean,
    default: false 
  }
}, {
    timestamps: true
});




module.exports = mongoose.model('Links', linkSchema)