import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Headers.css';

const Headers = () => {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo retro-text" onClick={handleHome}>
          Pong Game
        </div>
      </div>
    </header>
  );
};

export default Headers;
