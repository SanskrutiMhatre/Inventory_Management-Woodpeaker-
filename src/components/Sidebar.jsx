import React from 'react';
import { 
  BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsListCheck, BsCartPlusFill
} from 'react-icons/bs';
import { LuLogOut } from 'react-icons/lu'; // Corrected import path
import { MdDocumentScanner } from 'react-icons/md';
import { FaHistory } from 'react-icons/fa'; // Corrected import path
import { useNavigate } from 'react-router-dom';

function Sidebar({ openSidebarToggle, OpenSidebar, handleViewChange }) {
  const navigate = useNavigate(); // Initialize navigate function inside the component

  const handleLogout = () => {
    // Perform any logout operations here (e.g., clear user data, tokens)
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
          <BsCart3 className='icon_header' /> Medical
        </div>
        <span className='icon close_icon' onClick={OpenSidebar}>X</span>
      </div>

      <ul className='sidebar-list'>
        <li className='sidebar-list-item'>
          <span onClick={() => handleViewChange('home')}>
            <BsGrid1X2Fill className='icon' /> Dashboard
          </span>
        </li>
        <li className='sidebar-list-item'>
          <span onClick={() => handleViewChange('products')}>
            <BsFillArchiveFill className='icon' /> View Products
          </span>
        </li>
        <li className='sidebar-list-item'>
          <span onClick={() => handleViewChange('upload')}>
            <BsListCheck className='icon' /> Upload Data
          </span>
        </li>
        <li className='sidebar-list-item'>
          <span onClick={() => handleViewChange('scan')}>
            <MdDocumentScanner className='icon' /> Scanner
          </span>
        </li>
        <li className='sidebar-list-item'>
          <span onClick={() => handleViewChange('history')}>
            <FaHistory className='icon' /> History
          </span>
        </li>
        <li className='sidebar-list-item'>
          <span onClick={() => handleViewChange('orders')}>
            <BsCartPlusFill className='icon' /> Orders
          </span>
        </li>
        <li className='sidebar-list-item'>
          <span onClick={handleLogout}>
            <LuLogOut className='icon' /> Logout
          </span>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
