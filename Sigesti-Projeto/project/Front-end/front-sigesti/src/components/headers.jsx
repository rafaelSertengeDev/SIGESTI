import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      backgroundColor: '#282c34',
      color: 'white'
    }}>
      <h2>SIGESTI</h2>
      <div>
        <span style={{ marginRight: 15 }}>
          Olá, {usuario?.nome || 'Usuário'}
        </span>
        <button 
          onClick={handleLogout} 
          style={{
            backgroundColor: '#61dafb',
            border: 'none',
            padding: '8px 15px',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          Sair
        </button>
      </div>
    </header>
  );
}

export default Header;
