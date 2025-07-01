import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DestinationList from './components/DestinationList';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/explore"
          element={
            <div className="min-h-screen bg-gray-100 pt-2">
              <h1 className="text-3xl font-bold text-center my-6">Travel Destination Explorer</h1>
              <DestinationList />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
