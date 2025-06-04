// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Chamadas from "./pages/Chamadas";
import Itens from "./pages/Itens";

function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="/chamadas" element={<Chamadas />} />
        <Route path="/itens" element={<Itens />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;