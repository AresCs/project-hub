import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Downloader from './pages/Downloader';
import SidebarMenu from './components/SidebarMenu/SidebarMenu';
import Spotify from './pages/Spotify';
import Youtube from './pages/Youtube';

function App() {
  return (
    <Router>
      <SidebarMenu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/downloader" element={<Downloader />} />
        <Route path="/downloader/spotify" element={<Spotify />} />
        <Route path="/downloader/youtube" element={<Youtube />} />
      </Routes>
    </Router>
  );
}


export default App;
