const mongoose =  require('mongoose')
const fs = require('fs'); 
const Story = require('../models/storyModel');    
async function loadStories() {
  try {
  

    const data = fs.readFileSync('stories.json', 'utf8');
    const stories = JSON.parse(data);

    const existingCount = await Story.countDocuments();
    if (existingCount === 0) {
      await Story.insertMany(stories);
      console.log('Stories uploaded successfully!');
    } else {
      console.log('Stories already exist. Skipping upload.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

loadStories();





exports.getAllStories = async (req, res) => {
    try {
        const stories = await Story.find(); 
        console.log(stories);  
        return res.status(200).json({
            success: true,
            data: stories,
        });
    } catch (error) {
        console.error(error); 
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


exports.StoriesDetails = async(req,res) => {
  try {
    const {id} = req.params
    const storiesDetails = await Story.findById(id)

    if (!storiesDetails) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
 return res.status(200).json({
    success: true,
    data: storiesDetails
   })
  } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
