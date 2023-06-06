import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SideBarItem from './sidebar-item';

import './styles.css';
import logo from '../../assets/images/white-logo.png';
import LogoutIcon from '../../assets/icons/logout.svg';

function SideBar({ menu, onLogout }){
  const location = useLocation();
  const navigate = useNavigate();

  const [active, setActive] = useState(1);

  useEffect(() => {
    menu.forEach((element) => {
      if (location.pathname === element.path) {
        setActive(element.id);
      }
    });
  }, [location.pathname]);

  const handleLogout = () => {
    // Get the token from local storage
    const token = localStorage.getItem('token');
  
    // Clear token and role from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  
    // Make the logout request with the token in the header
    axios
      .get('http://localhost:80/api/logout', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data); 
      })
      .catch((error) => {
        // Handle error
        console.error(error);
      });
  
    // Redirect to the login page
    navigate('/login');
    onLogout();
  };

  const handleNavigation = (id) => {
    setActive(id);
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-container">
        <div className="sidebar-logo-container">
          <img src={logo} alt="logo" />
        </div>

        <div className="sidebar-container">
          <div className="sidebar-items">
            {menu.map((item, index) => (
              <div key={index} onClick={() => handleNavigation(item.id)}>
                <SideBarItem active={item.id === active} item={item} />
              </div>
            ))}
          </div>

        <div className="sidebar-footer">
            <span className="sidebar-item-label" onClick={handleLogout}>
            Logout
            </span>
           <img
            src={LogoutIcon}
             alt="icon-logout"
            className="sidebar-item-icon"
         onClick={handleLogout}
           />
         </div>
        </div>
      </div>
    </nav>
  );
}

export default SideBar;
