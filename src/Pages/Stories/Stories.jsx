import Nav from "../../Components/Nav"
import BackgroundStories from "../../Components/BackgroundStories";
import StoriesPage from "../../Components/StoriesPage";
import Footer from "../../Components/Footer"

function Stories() {
  return (
    <div>

        <div>
            
        <Nav/>
        </div>

        <div>
           <BackgroundStories/> 
        </div>

        <div>
            <StoriesPage/>
        </div>
        <div>
            <Footer/>
        </div>

    </div>
  )
}

export default Stories