

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LandingPage from './InfoScreen';
import ShowChannels from './showChannel';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/Landing' element={<LandingPage/>} />
          <Route path='/Channel'  element={<ShowChannels/>}  />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
