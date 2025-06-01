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
featured: {
  type: Boolean,
  default: false,
},
  featuredAt: {
    type:Date,
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
 
tags:{
  type:[String],
  required:true
},

  location: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  like:{
    type:Number,
    default:0,
  },

    views:{
    type:Number,
    default:0,
  },
  likedBy: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
}],

  viewedBy: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
}],
 embedUrl:{
type:String,
required: false,
 },

  status: {
    type: String,
    enum:['pending', 'Published', 'rejected'],
    default:'pending'
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