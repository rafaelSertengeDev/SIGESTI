import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList, faBoxOpen, faUsers } from "@fortawesome/free-solid-svg-icons";
import "../styles/Dashboard.css";



const Dashboard = () => {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerfil = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/");

      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const userId = decodedToken.id;

        const response = await fetch(`http://localhost:3000/perfil`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsuario(data);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        navigate("/");
      }
    };

    fetchPerfil();
  }, [navigate]);

  const irPara = (rota) => navigate(rota);

  if (!usuario) return <p>Carregando...</p>;

  return (
    <>
      <Header />
      <main className="dashboard-container">
  <h1 className="dashboard-title">Bem-vindo, {usuario.nome}!</h1>

  <div className="button-group">
  <button
  onClick={() => irPara("/chamadas")}
  className="dashboard-button blue"
  aria-label="Ir para a página de Chamadas"
>
  <FontAwesomeIcon icon={faClipboardList} className="icon" /> Chamadas
</button>

  <button onClick={() => irPara("/itens")} className="dashboard-button green">
    <FontAwesomeIcon icon={faBoxOpen} /> Itens
  </button>
  

  {usuario.cargo === "admin" && (
    <button onClick={() => irPara("/usuarios")} className="dashboard-button purple">
      <FontAwesomeIcon icon={faUsers} /> Usuários
    </button>
  )}
</div>

</main>

    </>
  );
};

export default Dashboard;


