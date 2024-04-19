import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/home";
import "./Styles/tailwind.css";
// import "./Styles/Style.scss";

const App = () => {
    return (
      <Router>
       
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/headphones" element={<HeadPhones />} />
            <Route path="/speakers" element={<Speakers />} />
            <Route path="/earphones" element={<Earphones />} /> */}
  
           
          </Routes>
     
      </Router>
    );
  };
  
  export default App;
  