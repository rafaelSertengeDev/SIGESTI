import React from 'react';
import Header from '../components/Header';

const Dashboard = () => {
  return (
    <>
      <Header />
      <main style={{ maxWidth: 600, margin: '50px auto', padding: '0 20px' }}>
        <h1>Painel Principal</h1>
        <p>Bem-vindo ao sistema SIGESTI! Aqui você pode gerenciar as chamadas e os itens de TI.</p>
        {/* Aqui você pode adicionar mais componentes ou funcionalidades do dashboard */}
      </main>
    </>
  );
};

export default Dashboard;