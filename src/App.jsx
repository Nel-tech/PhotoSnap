import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./Styles/tailwind.css";
import "./Styles/index.css"
import Home from "./Pages/Home/home";
import Stories from "./Pages/Stories/Stories";
import Features from "./Pages/Features/Features";

const App = () => {
    return (
      <Router>
       
          <Routes>
            <Route path="/home" element={<Home />} />
             <Route path="/stories" element={<Stories />} />
             <Route path="/features" element={<Features />} />
           
           
          </Routes>
     
      </Router>
    );
  };
  
  export default App;
  