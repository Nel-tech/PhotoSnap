import React from 'react'
import HeroSection from './HeroSection'
import Nav from '@/components/Nav'
import PostStories from '@/app/stories/PostStories'
import Protected from '@/components/Protected'
function Stories() {
  return (

    <Protected allowedRoles={['user']}>
    <div>
    <Nav />
    <HeroSection />

   
    <PostStories />
   
    </div>
    </Protected>
  )
}

export default Stories