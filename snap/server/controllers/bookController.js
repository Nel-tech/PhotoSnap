const mongoose = require('mongoose');
const fs = require('fs');
const Story = require('../models/bookModel');  

mongoose.connect('mongodb://localhost:27017/Snap', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

fs.readFile('stories.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the JSON file:', err);
    return;
  }
  const stories = JSON.parse(data);
  
  // Save the stories to MongoDB
  Story.insertMany(stories)
    .then(() => console.log('Stories uploaded successfully!'))
    .catch((err) => console.error('Error uploading stories:', err));
});

exports.getAllStories = async (req, res, next) => {
      try {
    const stories = await Story.find();
    res.status(200).json(stories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch stories' });
  }
}
