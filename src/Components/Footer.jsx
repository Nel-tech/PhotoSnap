import {
  faGithub,
  faLinkedinIn,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

function Footer() {
  function date() {
    const CurrentYear = new Date().getFullYear();

    return CurrentYear;
  }
  return (
    <div>
      <div className="footer">
        <div className="footer-flex">

        <main>
          <div>
            <img src="/images/shared/desktop/Footerlogo.svg" className="w-80" alt="" />
          <div className="footer-divs">
            <div>
              <a href="">
                <FontAwesomeIcon
                  icon={faXTwitter}
                  fade
                  className="footer-socials"
                />
              </a>
            </div>

            <div>
              <a href="">
                <FontAwesomeIcon
                  icon={faGithub}
                  fade
                  className="footer-socials"
                />
              </a>
            </div>
            <div>
              <a href="">
                <FontAwesomeIcon
                  icon={faLinkedinIn}
                  fade
                  className="footer-socials"
                />
              </a>
            </div>
          </div>
          </div>


          <div>
            <div>
              <Link>
                <a href="" className="footer-links">
                  HOME
                </a>
              </Link>
            </div>

            <div>
              <Link>
                <a href="" className="footer-links">
                  STORIES
                </a>
              </Link>
            </div>

            <div>
              <Link>
                <a href="" className="footer-links">
                  FEATURES
                </a>
              </Link>
            </div>

            <div>
              <Link>
                <a href="" className="footer-links">
                  PRICING
                </a>
              </Link>
            </div>
          </div>
        </main>

        <div>
          <button className="featured-btn">
            GET AN INVITE <span aria-hidden="true">&rarr;</span>
          </button>

          <div>
            <h3 className="copyright">Copyright {date()}&copy;Edition</h3>
          </div>
        </div>
        </div>
      </div>
     
    </div>
  );
}

export default Footer;
