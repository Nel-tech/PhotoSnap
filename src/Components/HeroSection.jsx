function HeroSection() {
  return (
    <div>

      <div className="flex">

      <div className="hero-background">
        <div className="gradient-bar"></div>
        <h1 className="primary-header-text">CREATE AND SHARE YOUR PHOTO STORIES.</h1>
        <p className="secondary-header-text">
          Photosnap is a platform for photographers and visual storytellers. We
          make it easy to share photos, tell stories and connect with others.
        </p>

        <button>
        <div className=""> 
         <button  className="btn-invite">
           GET AN INVITE <span aria-hidden="true">&rarr;</span>
         </button>
       </div>
        </button>
      </div>
      <div>
        <img src="/images/home/desktop/create-and-share.jpg" alt="" className="img-hero" />
      </div>
      </div>
    </div>
  );
}
export default HeroSection;
