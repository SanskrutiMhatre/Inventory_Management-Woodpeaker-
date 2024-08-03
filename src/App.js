import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import MedicalDashboard from './pages/MedicalDashboard';
import DoctorDashboard from './pages/DoctorDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/medical-dashboard" element={<MedicalDashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
