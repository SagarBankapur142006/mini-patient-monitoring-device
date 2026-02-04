import "./App.css";

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AmbulancePage from "./pages/AmbulancePage";
import DoctorDashboard from "./pages/DoctorDashboard";

function App() {
  const [patientData, setPatientData] = useState(null);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<AmbulancePage setPatientData={setPatientData} />}
        />
        <Route
          path="/doctor"
          element={<DoctorDashboard patientData={patientData} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
