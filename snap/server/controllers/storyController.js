
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

exports.BookMark = async(req,res) => {
  try {
    const {id} = req.params
    const story = await Story.findById(id)
    if(!story){
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      })
    }
    story.bookmarked = !story.bookmarked
    await story.save()
    return res.status(200).json({
      success: true,
      message: 'Story bookmarked'
    })
  } catch (error) {
    
  }
}
exports.getBookMarkedStories = async(req,res) => {
  try {
    const stories = await Story.find({bookmarked: true})
    return res.status(200).json({
      success: true,
      data: stories
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

exports.LikeStory = async(req,res) => {
  try {
    const { id } = req.params
    const story = await Story.findById(id)
    if(!story){
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      })
    }
    story.likes = story.likes > 0 ? story.likes - 1 : story.likes + 1
    await story.save()
    return res.status(200).json({
      success: true,
      message: story.likes > 0 ? 'Story liked' : 'Story unliked',
      data: story
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

exports.getLikedStories = async(req,res) => {
  try {
    const stories = await Story.find({likes: {$gt: 0}})
    return res.status(200).json({
      success: true,
      data: stories
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}