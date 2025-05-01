import React from 'react'
import Protected from '@/components/Protected'
import StoryDetails from './Story-Details'
function page() {
  return (
    <div>
        <Protected allowedRoles={['user']}>
        <StoryDetails/>
        </Protected>
    </div>
  )
}

export default page