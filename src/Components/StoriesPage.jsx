import DesktopFeatured from "./Dfeatured";

function StoriesPage() {
  return (
    <>
      <div>
        <div className="stories-page relative">
          {DesktopFeatured.map((val) => (
            <div key={val.id}>
              <div className="stories-container">
                <img src={val.Img} alt="" className="img-stories" />
              <div className="overlay-stories"></div>

                <div className="stories-details">
                  <p className="stories-year">{val.Year}</p>
                  <h2 className="stories-header">{val.Name}</h2>
                  <p className="stories-author">{val.Author}</p>

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

export default StoriesPage;
