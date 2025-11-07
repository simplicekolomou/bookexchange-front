import '../styles/App.css'
import {Home} from "./sections/Home.tsx";
import {Footer} from "./layout/Footer.tsx";
import {Login} from "./sections/Login.tsx";
import {Collection} from "./sections/Collection.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Registration} from "./sections/Registration.tsx";
import {SearchSection} from "./sections/SearchSection.tsx";
function App() {
  return (
      <Router>
          <div className="App">
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/registration" element={<Registration />} />
                  <Route path="/collection" element={<Collection />} />
                  <Route path="search" element={<SearchSection />} />
              </Routes>
              <Footer />
          </div>
      </Router>
  )
}
export default App
