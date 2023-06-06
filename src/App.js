import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import SideBar from './components/Sidebar';
import sidebar_menu from './constants/sidebar-menu';

import './App.css';
import Demandes from './pages/Orders';
import Signals from './pages/Signal/index.jsx';
import AjouterCompte from './pages/AjouterCompte/index.jsx';
import LoginPage from './pages/Login/LoginPage.js';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  const handleLogin = (newToken, newRole) => {
    setToken(newToken);
    setRole(newRole);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
    console.log('logout');
  };

  return (
    <Router>
      <div className='dashboard-container'>
        {token && role==='admin' && <SideBar menu={sidebar_menu} onLogout={handleLogout}/>}

        <Routes>
          {!token || role!=='admin'? (
            <>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Navigate to="/orders" />} />
              <Route path="/orders" element={<Demandes />} />
              <Route path="/signals" element={<Signals />} />
              <Route path="/ajouter" element={<AjouterCompte />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
