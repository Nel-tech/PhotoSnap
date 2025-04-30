"use client"

import Protected from "@/components/Protected"
import UploadStoryPage from "./UploadStoryPage"

function Page() {
    return (
        <div>
            <Protected allowedRoles={['user']}>
                <UploadStoryPage />
            </Protected>
        </div>
    )
}

export default Page