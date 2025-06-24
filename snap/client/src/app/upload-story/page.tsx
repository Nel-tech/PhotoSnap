"use client"

import Protected from "@/components/Protected"
import UploadStoryPage from "./UploadStoryPage"
import Footer from "@/components/Footer"

function Page() {
    return (
        <div>
            <Protected allowedRoles={['user']}>
                <UploadStoryPage />
                <Footer/>
            </Protected>
        </div>
    )
}

export default Page