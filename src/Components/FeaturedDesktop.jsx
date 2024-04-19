import DesktopFeatured from "./Dfeatured";

function FeaturedDesktop() {
  return (
    <>
    <div>
      <div>
        {DesktopFeatured.map((val) => (
          <div key={val.id}>
            <div>
              <img src={val.Img} alt="" />

              <div>
                <h2>{val.Name}</h2>
                <p>{val.Author}</p>

                <hr />
                <div className="">
                  <button className="btn-stories">
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
