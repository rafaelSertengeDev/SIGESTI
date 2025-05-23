// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const resposta = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro || 'Erro ao fazer login.');
        return;
      }

      localStorage.setItem('token', dados.token);
      localStorage.setItem('usuario', JSON.stringify(dados.usuario));

      navigate('/dashboard');
    } catch (error) {
      setErro('Erro interno. Tente novamente.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto' }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="E-mail" value={email}
          onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 10 }} />
        <input type="password" placeholder="Senha" value={senha}
          onChange={(e) => setSenha(e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 10 }} />
        <button type="submit" style={{ width: '100%', padding: 10 }}>Entrar</button>
      </form>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
    </div>
  );
}

export default Login;
