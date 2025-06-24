import React from 'react'
import Protected from '@/components/Protected'
import StoryDetails from './Story-Details'
import Footer from '@/components/Footer'
function page() {
  return (
    <div>
        <Protected allowedRoles={['user']}>
        <StoryDetails/>
        <Footer/>
        </Protected>
    </div>
  )
}

export default page