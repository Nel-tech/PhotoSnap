import Protected from "@/components/Protected"
import UploadPage from "./uploadForm"
import UploadStoryPage from "./UploadStoryPage"

function page() {
  return (
    <div>

        <Protected allowedRoles={['user']}>

<UploadPage/>
<UploadStoryPage/>
        </Protected>
    </div>
  )
}

export default page