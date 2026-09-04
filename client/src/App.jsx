import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ReportForm from "./pages/ReportForm";
import HotspotList from "./pages/HotspotList";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/report" element={<ReportForm />} />
                <Route path="/hotspots" element={<HotspotList />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;