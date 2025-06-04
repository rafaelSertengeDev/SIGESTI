import React from "react";

const FiltrosChamadas = ({ filtros, onChange, tecnicos, setFiltros, todosChamados }) => {
  const categorias = [...new Set(todosChamados.map((ch) => ch.categoria))];

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...filtros, [name]: value });
  };

  return (
    <div className="filtros-container">
      <div className="filtro-item">
        <label>Status:</label>
        <select name="status" value={filtros.status} onChange={handleChange}>
          <option value="">Todos</option>
          <option value="Registrado">Registrado</option>
          <option value="Resolvido">Resolvido</option>
          <option value="Pendente">Pendente</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>

      <div className="filtro-item">
        <label>Técnico:</label>
        <select
          name="tecnico"
          value={filtros.tecnico}
          onChange={(e) => setFiltros({ ...filtros, tecnico: e.target.value })}
        >
          <option value="">Todos</option>
          {tecnicos.map((tecnico) => (
            <option key={tecnico.id} value={tecnico.nome}>
              {tecnico.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="filtro-item">
        <label>Categoria:</label>
        <select name="categoria" value={filtros.categoria} onChange={handleChange}>
          <option value="">Todas</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="filtro-item">
        <label>Ordem por Data:</label>
        <select name="dataOrdem" value={filtros.dataOrdem} onChange={handleChange}>
          <option value="desc">Mais recentes</option>
          <option value="asc">Mais antigas</option>
        </select>
      </div>
    </div>
  );
};

export default FiltrosChamadas;