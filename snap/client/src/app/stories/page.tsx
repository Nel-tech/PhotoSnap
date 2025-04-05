import React from 'react'
import HeroSection from './HeroSection'
import Nav from '@/components/Nav'
import PostStories from '@/app/stories/PostStories'
function Stories() {
  return (
    <div>
    <Nav />
    <HeroSection />
    <PostStories />
    </div>
  )
}

export default Stories