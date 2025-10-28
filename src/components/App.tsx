import '../styles/App.css'
import {BodyContent} from "./sections/BodyContent.tsx";
import {Footer} from "./layout/Footer.tsx";
import {Login} from "./sections/Login.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
      <Router>
          <div className="App">
              <Routes>
                  <Route path="/" element={<BodyContent />} />
                  <Route path="/login" element={<Login />} />
              </Routes>
              <Footer />
          </div>
      </Router>
  )
}

export default App
