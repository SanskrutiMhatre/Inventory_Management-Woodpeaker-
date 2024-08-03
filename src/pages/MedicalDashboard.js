import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Home from '../components/Home';
import Products from '../components/Products';
import Upload from '../components/Upload';
import Scanner from '../components/Scanner';
import History from '../components/History';
import Orders from '../components/Orders';
import '../App.css';

function MedicalDashboard() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [currentView, setCurrentView] = useState('home');

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  let Content;
  switch (currentView) {
    case 'home':
      Content = <Home />;
      break;
    case 'products':
      Content = <Products />;
      break;
    case 'upload':
      Content = <Upload />;
      break;
    case 'scan':
      Content = <Scanner />;
      break;
      case 'history':
        Content = <History />;
        break;
        case 'orders':
          Content = <Orders />;
          break;
    default:
      Content = <Home />;
  }

  return (
    <div className='grid-container'>
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} handleViewChange={handleViewChange} />
      <div className='content'>
        {Content}
      </div>
    </div>
  );
}

export default MedicalDashboard;
