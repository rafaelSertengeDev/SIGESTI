import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ConfirmModal from "../components/ConfirmModal";
import "../styles/itens.css";

const Itens = () => {
  const [itens, setItens] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [itemEditandoId, setItemEditandoId] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [itemParaDeletar, setItemParaDeletar] = useState(null);
  const navigate = useNavigate();

  const [novoItem, setNovoItem] = useState({
    nome: "",
    tipo: "",
    marca_modelo: "",
    numero_serie: "",
    localizacao: "",
    status: "ativo",
    responsavel_id: "",
    observacoes: ""
  });

  const fetchItens = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    try {
      const response = await fetch("http://localhost:3000/itens", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setItens(data);
      } else {
        console.error("Erro ao buscar itens");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  const fetchUsuarios = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  useEffect(() => {
    fetchItens();
    fetchUsuarios();
  }, [navigate]);

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
    setModoEdicao(false);
    setNovoItem({
      nome: "",
      tipo: "",
      marca_modelo: "",
      numero_serie: "",
      localizacao: "",
      status: "ativo",
      responsavel_id: "",
      observacoes: ""
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const valorConvertido = name === "responsavel_id" ? parseInt(value) : value;
    setNovoItem({ ...novoItem, [name]: valorConvertido });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const url = modoEdicao
      ? `http://localhost:3000/itens/editar/${itemEditandoId}`
      : "http://localhost:3000/itens/cadastrar";

    const method = modoEdicao ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(novoItem),
      });

      if (response.ok) {
        await fetchItens();
        toggleFormulario();
      } else {
        console.error("Erro ao salvar item");
      }
    } catch (error) {
      console.error("Erro ao enviar requisição:", error);
    }
  };

  const confirmarDeleteItem = (id) => {
    setItemParaDeletar(id);
    setModalAberto(true);
  };

  const deletarItem = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:3000/itens/deletar/${itemParaDeletar}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        await fetchItens();
      } else {
        console.error("Erro ao deletar item");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    } finally {
      setModalAberto(false);
      setItemParaDeletar(null);
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
        <h1 className="page-title">Lista de Itens</h1>

        <button className="button button-primary" onClick={toggleFormulario}>
          {mostrarFormulario ? "Cancelar" : "Novo Item"}
        </button>


        {mostrarFormulario && (
          <form onSubmit={handleSubmit} className="form-novo-item">
            <label>Nome:</label>
            <input name="nome" value={novoItem.nome} onChange={handleInputChange} required />

            <label>Tipo:</label>
            <input name="tipo" value={novoItem.tipo} onChange={handleInputChange} required />

            <label>Marca/Modelo:</label>
            <input name="marca_modelo" value={novoItem.marca_modelo} onChange={handleInputChange} />

            <label>Número de Série:</label>
            <input name="numero_serie" value={novoItem.numero_serie} onChange={handleInputChange} />

            <label>Localização:</label>
            <input name="localizacao" value={novoItem.localizacao} onChange={handleInputChange} />

            <label>Status:</label>
            <select name="status" value={novoItem.status} onChange={handleInputChange}>
              <option value="ativo">Ativo</option>
              <option value="em manutenção">Em Manutenção</option>
              <option value="descartado">Descartado</option>
            </select>

            <label>Responsável:</label>
            <select name="responsavel_id" value={novoItem.responsavel_id || ""} onChange={handleInputChange}>
              <option value="">Nenhum</option>
              {usuarios.map((user) => (
                <option key={user.id} value={user.id}>{user.nome}</option>
              ))}
            </select>

            <label>Observações:</label>
            <textarea name="observacoes" value={novoItem.observacoes} onChange={handleInputChange} />

            <button type="submit" className="button button-success">
              {modoEdicao ? "Salvar Alterações" : "Cadastrar Item"}
            </button>
          </form>
        )}

        <ul className="lista-itens">
          {itens.map((item) => (
            <li key={item.id} className="item">
              <p><strong>Nome:</strong> {item.nome}</p>
              <p><strong>Tipo:</strong> {item.tipo}</p>
              <p><strong>Marca/Modelo:</strong> {item.marca_modelo}</p>
              <p><strong>Número de Série:</strong> {item.numero_serie}</p>
              <p><strong>Localização:</strong> {item.localizacao}</p>
              <p><strong>Status:</strong> {item.status}</p>
              <p><strong>Data de Entrada:</strong> {item.data_entrada}</p>
              <p><strong>Responsável:</strong> {usuarios.find(u => u.id === item.responsavel_id)?.nome || "N/A"}</p>
              <p><strong>Observações:</strong> {item.observacoes || "Sem observações"}</p>

              <div className="acoes-item">
                <button className="button button-edit" onClick={() => {
                  setNovoItem(item);
                  setItemEditandoId(item.id);
                  setModoEdicao(true);
                  setMostrarFormulario(true);
                }}>Editar</button>
                <button className="button button-danger" onClick={() => confirmarDeleteItem(item.id)}>
                  Deletar
                </button>
              </div>
            </li>
          ))}
        </ul>

        <ConfirmModal
          isOpen={modalAberto}
          message="Tem certeza que deseja deletar este item?"
          onConfirm={deletarItem}
          onCancel={() => {
            setModalAberto(false);
            setItemParaDeletar(null);
          }}
        />
      </main>
    </>
  );
};

export default Itens;