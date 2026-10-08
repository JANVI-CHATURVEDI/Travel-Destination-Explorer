import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import LandingPage from './components/LandingPage';
import ExplorePage from './components/ExplorePage';
import DestinationDetail from './components/DestinationDetail';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col bg-stone-50">
        <Navbar />
        <main className="flex-1">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/explore/:id" element={<DestinationDetail />} />
            </Routes>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
