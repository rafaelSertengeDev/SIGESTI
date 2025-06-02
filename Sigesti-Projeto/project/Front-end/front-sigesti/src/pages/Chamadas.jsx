import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import FiltrosChamadas from "../components/FiltrosChamadas";
import "../styles/chamadas.css";

const Chamadas = () => {
  const [chamados, setChamados] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [filtros, setFiltros] = useState({
    status: "",
    tecnico: "",
    categoria: "",
    dataOrdem: "desc",
  });

  const [novoChamado, setNovoChamado] = useState({
    categoria: "",
    descricao: "",
    equipamento_id: "",
  });

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

  const [tecnicos, setTecnicos] = useState([]);

useEffect(() => {
  const fetchTecnicos = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/tecnicos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTecnicos(data);
      }
    } catch (error) {
      console.error("Erro ao buscar técnicos:", error);
    }
  };

  fetchTecnicos();
}, []);

  const formatarData = (dataStr) => {
    const dataFormatada = new Date(dataStr.replace(" ", "T"));
    return isNaN(dataFormatada) ? "Data inválida" : dataFormatada.toLocaleString();
  };

  const handleFiltroChange = (filtrosAtualizados) => {
    setFiltros(filtrosAtualizados);
  };

  const chamadosFiltrados = chamados
    .filter((ch) =>
      (!filtros.status || ch.status === filtros.status) &&
      (!filtros.tecnico || ch.tecnico_nome === filtros.tecnico) &&
      (!filtros.categoria || ch.categoria === filtros.categoria)
    )
    .sort((a, b) => {
      const dataA = new Date(a.data_registro);
      const dataB = new Date(b.data_registro);
      return filtros.dataOrdem === "asc" ? dataA - dataB : dataB - dataA;
    });

  const toggleFormulario = () => setMostrarFormulario((prev) => !prev);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoChamado({ ...novoChamado, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:3000/chamados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(novoChamado),
      });

      if (response.ok) {
        const chamadoCriado = await response.json();
        setChamados([...chamados, chamadoCriado]);
        setNovoChamado({ categoria: "", descricao: "", equipamento_id: "" });
        setMostrarFormulario(false);
      } else {
        console.error("Erro ao criar chamado");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  return (
    <>
      <Header />
      <main className="main-container">
        <h1 className="page-title">Lista de Chamadas</h1>

        <button
          onClick={toggleFormulario}
          className="button button-primary"
        >
          {mostrarFormulario ? "Cancelar" : "Nova Chamada"}
        </button>

        {mostrarFormulario && (
          <form onSubmit={handleSubmit} className="form-nova-chamada">
            <label>Categoria:</label>
            <select
              name="categoria"
              value={novoChamado.categoria}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecione</option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Rede">Rede</option>
            </select>

            <label>Descrição:</label>
            <textarea
              name="descricao"
              value={novoChamado.descricao}
              onChange={handleInputChange}
              required
            />

            <label>ID do Equipamento:</label>
            <input
              type="number"
              name="equipamento_id"
              value={novoChamado.equipamento_id}
              onChange={handleInputChange}
              required
            />

            <button type="submit" className="button button-success">
              Criar Chamada
            </button>
          </form>
        )}

        <FiltrosChamadas
          filtros={filtros}
          todosChamados={chamados}
          onChange={handleFiltroChange}
          setFiltros={setFiltros}
  tecnicos={tecnicos}
        />

        {chamadosFiltrados.length === 0 ? (
          <p className="sem-chamados">Nenhum chamado encontrado.</p>
        ) : (
          <ul className="lista-chamados">
            {chamadosFiltrados.map((chamado) => (
              <li key={chamado.id} className="chamado-item">
                <p><strong>Chamado:</strong> {chamado.id}</p>
                <p><strong>Equipamento:</strong> {chamado.equipamento_nome}</p>
                <p><strong>Descrição:</strong> {chamado.descricao}</p>
                <p><strong>Data de Registro:</strong> {formatarData(chamado.data_registro)}</p>
                <p><strong>Categoria:</strong> {chamado.categoria}</p>
                <p><strong>Status:</strong> {chamado.status}</p>
                <p><strong>Técnico:</strong> {chamado.tecnico_nome}</p>
                <p><strong>Solução:</strong> {chamado.solucao || "Ainda não resolvido"}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
};

export default Chamadas;