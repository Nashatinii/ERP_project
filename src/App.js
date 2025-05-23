
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';

import DocumentManager from './pages/DocumentManager';

import Navbar from "./components/Navbar";



function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/document-manager" element={<DocumentManager />} />
      </Routes>
    </Router>
  );
}

export default App;
