import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Test from "./pages/Test";
import Contact from "./pages/Contact"; // Nouvelle page Contact
import Diagnostic from "./pages/Diagnostic"; 
import PlanAction from "./components/PlanAction";
import Navbar from "./components/Navbar"; // Ajout de la Navbar
import Footer from "./components/Footer";
import Demo from "./pages/Demo";

// Importation du Footer
import "./styles.css";

function App() {
  return (
    <Router>
      <Navbar /> {/* Navbar pour naviguer */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/test" element={<Test />} />
        <Route path="/contact" element={<Contact />} /> {/* Nouvelle route */}
        <Route path="/diagnostic" element={<Diagnostic />} /> 
        <Route path="/planaction" element={<PlanAction />} /> 
        <Route path="/demo" element={<Demo/>} /> 
       

      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
