import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DistrictDashboard from "./pages/DistrictDashboard";
import "./i18n";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/district/:state/:district/:year"
          element={<DistrictDashboard />}
        />
      </Routes>
    </Router>
  );
}

export default App;
