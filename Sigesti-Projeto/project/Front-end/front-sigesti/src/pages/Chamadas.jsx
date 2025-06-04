import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import FiltrosChamadas from "../components/FiltrosChamadas.jsx";
import "../styles/chamadas.css";
import ConfirmModal from "../components/ConfirmModal";


const Chamadas = () => {
  const [modoEdicao, setModoEdicao] = useState(false);
  const [chamadoEditandoId, setChamadoEditandoId] = useState(null);
  const [chamados, setChamados] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
const [modalAberto, setModalAberto] = useState(false);
const [chamadoParaDeletar, setChamadoParaDeletar] = useState(null);

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
    tecnico_id: "",
    status: "",
    solucao: ""
  });

  const [tecnicos, setTecnicos] = useState([]);
  const [equipamentos, setEquipamentos] = useState([]);

  const navigate = useNavigate();

  const fetchChamados = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    try {
      const response = await fetch("http://localhost:3000/chamados", {
        headers: { Authorization: `Bearer ${token}` },
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

  useEffect(() => {
    fetchChamados();
  }, [navigate]);

  useEffect(() => {
    const fetchTecnicos = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:3000/tecnicos", {
          headers: { Authorization: `Bearer ${token}` },
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

  useEffect(() => {
    const fetchEquipamentos = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:3000/itens", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setEquipamentos(data);
        }
      } catch (error) {
        console.error("Erro ao buscar equipamentos:", error);
      }
    };

    fetchEquipamentos();
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
    const valorConvertido =
      name === "equipamento_id" || name === "tecnico_id"
        ? parseInt(value)
        : value;

    setNovoChamado({ ...novoChamado, [name]: valorConvertido });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");

  const body = { ...novoChamado };
  if (!body.solucao) delete body.solucao;

  try {
    let response;
    if (modoEdicao && chamadoEditandoId) {
      // Modo de edição: atualizar chamado existente
      response = await fetch(`http://localhost:3000/chamados/editar/${chamadoEditandoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
    } else {
      // Modo de criação: novo chamado
      response = await fetch("http://localhost:3000/chamados/cadastrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
    }

    if (response.ok) {
      await fetchChamados();
      setNovoChamado({
        categoria: "",
        descricao: "",
        equipamento_id: "",
        tecnico_id: "",
        status: "",
        solucao: ""
      });
      setMostrarFormulario(false);
      setModoEdicao(false); // sair do modo edição
      setChamadoEditandoId(null);
    } else {
      console.error("Erro ao salvar chamado");
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
  }
  };

  const confirmarDeleteChamado = (id) => {
  setChamadoParaDeletar(id);
  setModalAberto(true);
};

const deletarChamado = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      `http://localhost:3000/chamados/deletar/${chamadoParaDeletar}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.ok) {
      await fetchChamados();
    } else {
      console.error("Erro ao deletar chamado");
    }
  } catch (error) {
    console.error("Erro ao enviar requisição de deletar:", error);
  } finally {
    setModalAberto(false);
    setChamadoParaDeletar(null);
  }
};
  return (
    <>
      <Header />
      <main className="main-container">
        <button
  onClick={() => navigate("/dashboard")}
  className="button button-secondary"
  style={{ marginBottom: "1rem" }}
>
  ← Voltar ao Dashboard
</button>
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

            <label>Equipamento:</label>
            <select
              name="equipamento_id"
              value={novoChamado.equipamento_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecione um equipamento</option>
              {equipamentos.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome || item.descricao}
                </option>
              ))}
            </select>

            <label>Técnico:</label>
            <select
              name="tecnico_id"
              value={novoChamado.tecnico_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecione um técnico</option>
              {tecnicos.map((tecnico) => (
                <option key={tecnico.id} value={tecnico.id}>
                  {tecnico.nome}
                </option>
              ))}
            </select>

            <label>Status:</label>
            <select
              name="status"
              value={novoChamado.status}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecione o status</option>
              <option value="Registrado">Registrado</option>
              <option value="Resolvido">Resolvido</option>
              <option value="Pendente">Pendente</option>
              <option value="Cancelado">Cancelado</option>
            </select>

            <label>Solução (opcional):</label>
            <textarea
              name="solucao"
              value={novoChamado.solucao}
              onChange={handleInputChange}
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

                <div className="acoes-chamado">
                  <button
                    className="button button-edit"
                    onClick={() => {
                      setNovoChamado(chamado);
                      setChamadoEditandoId(chamado.id);
                      setModoEdicao(true);
                      setMostrarFormulario(true);
                    }}
                  >
                    Editar
                  </button>
                  <button
                     className="button button-danger"
  onClick={() => confirmarDeleteChamado(chamado.id)}
>
  Deletar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <ConfirmModal
  isOpen={modalAberto}
  message="Tem certeza que deseja deletar este chamado?"
  onConfirm={deletarChamado}
  onCancel={() => {
    setModalAberto(false);
    setChamadoParaDeletar(null);
  }}
/>
      </main>
    </>
  );
};

export default Chamadas;