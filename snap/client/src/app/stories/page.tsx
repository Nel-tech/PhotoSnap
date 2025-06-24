import React from 'react'
import HeroSection from './HeroSection'
import Nav from '@/components/Nav'
import PostStories from '@/app/stories/PostStories'
import Protected from '@/components/Protected'
import Footer from '@/components/Footer'
function Stories() {
  return (

    <Protected allowedRoles={['user']}>
    <div>
    <Nav />
    <HeroSection />

   
    <PostStories />
   <Footer/>
    </div>

    </Protected>
  )
}

export default Stories