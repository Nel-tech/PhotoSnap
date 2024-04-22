
import DesktopFeatured from "./Dfeatured";

function FeaturedDesktop() {
  const firstFourItems = DesktopFeatured.slice(0, 4);

  return (
    <>
      <div>
        <div className="featured-desktop relative">
          {firstFourItems.map((val) => (
            <div key={val.id} className="relative">
              <div>
                <img src={val.Img} alt="" className="img-featured" />

                <div className="overlay"></div> 
                
                <div className="featured-details">
                  <h2 className="featured-header">{val.Name}</h2>
                  <p className="featured-author">{val.Author}</p>
                 

                  <hr className="horizontal-line" />
                  <div className="">
                    <button className="featured-btn">
                      READ STORY <span aria-hidden="true">&rarr;</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default FeaturedDesktop;
