import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import Home from './pages/Home';
import ReportForm from './pages/ReportForm';
import HotspotList from './pages/HotspotList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/report" element={<Layout><ReportForm /></Layout>} />
        <Route path="/hotspots" element={<Layout><HotspotList /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;