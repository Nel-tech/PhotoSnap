const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  
    required: true,  
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    required: true,
  },
  categories: {
    type: [String],
    required: true,
  },

  estimatedReadingTime: {
    type: String,
    required: true,
  },
  bookmarkedBy: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
}],
 

  location: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  status: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
},
{ timestamps: true }
);

const Story = mongoose.model('Story', storySchema);

module.exports = Story;