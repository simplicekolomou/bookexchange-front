import '../styles/App.css'
import {Home} from "./sections/Home.tsx";
import {Footer} from "./layout/Footer.tsx";
import {Login} from "./sections/Login.tsx";
import {MyCollection} from "./sections/MyCollection.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Registration} from "./sections/Registration.tsx";
function App() {
  return (
      <Router>
          <div className="App">
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/registration" element={<Registration />} />
                  <Route path="/collection" element={<MyCollection />} />
              </Routes>
              <Footer />
          </div>
      </Router>
  )
}

export default App
