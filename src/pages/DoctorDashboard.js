// client/src/App.js
import React, { useState } from 'react';
import Receipt from '../components/Receipt';

import '../App.css';

const DoctorDashboard = () => {
  const [route, setRoute] = useState('/');

  const renderComponent = () => {
    switch (route) {
      case '/write-prescription':
        return <Receipt />;
      case '/logout':
        return <div>Logout Page</div>;
      default:
        return <Receipt />;
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <h1>Doctors Portal</h1>
        <ul>
          <li><a href="#" onClick={() => setRoute('/write-prescription')}>Write Prescription</a></li>
          <li><a href="#" onClick={() => setRoute('/logout')}>Logout</a></li>
        </ul>
      </nav>
      <div>
        {renderComponent()}
      </div>
    </div>
  );
};

export default DoctorDashboard;
