import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const Chamadas = () => {
  const [chamados, setChamados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChamados = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/");

      try {
        const response = await fetch("http://localhost:3000/chamados", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setChamados(data);
        } else {
          console.error("Erro ao buscar chamados");
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
      }
    };

    fetchChamados();
  }, [navigate]);

  return (
    <>
      <Header />
      <main className="p-4">
        <h1 className="text-2xl mb-4">Lista de Chamadas</h1>
        {chamados.length === 0 ? (
          <p>Nenhum chamado encontrado.</p>
        ) : (
          <ul className="space-y-4">
            {chamados.map((chamado) => (
              <li key={chamado.id} className="border p-4 rounded shadow">
                <strong>Descrição:</strong> {chamado.descricao} <br />
                <strong>Status:</strong> {chamado.status} <br />
                <strong>Data:</strong> {new Date(chamado.data_criacao).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
};

export default Chamadas;
