import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import Home from './pages/Home';
import ReportForm from './pages/ReportForm';
import HotspotList from './pages/HotspotList';
import MapView from './pages/MapView';
import Dashboard from './pages/Dashboard';
import PreventionTips from './pages/PreventionTips';
import Login from './pages/Login';
import ReportQueue from './pages/ReportQueue';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<Layout><Home /></Layout>} />
        <Route path="/report"     element={<Layout><ReportForm /></Layout>} />
        <Route path="/hotspots"   element={<Layout><HotspotList /></Layout>} />
        <Route path="/map"        element={<Layout><MapView /></Layout>} />
        <Route path="/dashboard"  element={<Layout><Dashboard /></Layout>} />
        <Route path="/prevention" element={<Layout><PreventionTips /></Layout>} />
        <Route path="/login"      element={<Layout><Login /></Layout>} />
        <Route path="/queue"      element={<Layout><ProtectedRoute><ReportQueue /></ProtectedRoute></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;