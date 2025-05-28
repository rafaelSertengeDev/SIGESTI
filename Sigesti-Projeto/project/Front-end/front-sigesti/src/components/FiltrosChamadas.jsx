import React from "react";

const FiltrosChamadas = ({ filtros, todosChamados, onChange }) => {
  const tecnicos = [...new Set(todosChamados.map((ch) => ch.tecnico_nome))];
  const categorias = [...new Set(todosChamados.map((ch) => ch.categoria))];

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...filtros, [name]: value });
  };

  return (
    <div className="filtros-container">
      <label>Status:</label>
      <select name="status" value={filtros.status} onChange={handleChange}>
        <option value="">Todos</option>
        <option value="Registrado">Registrado</option>
        <option value="Em andamento">Em andamento</option>
        <option value="Concluído">Concluído</option>
      </select>

      <label>Técnico:</label>
      <select name="tecnico" value={filtros.tecnico} onChange={handleChange}>
        <option value="">Todos</option>
        {tecnicos.map((tecnico) => (
          <option key={tecnico} value={tecnico}>
            {tecnico}
          </option>
        ))}
      </select>

      <label>Categoria:</label>
      <select name="categoria" value={filtros.categoria} onChange={handleChange}>
        <option value="">Todas</option>
        {categorias.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <label>Ordem por Data:</label>
      <select name="dataOrdem" value={filtros.dataOrdem} onChange={handleChange}>
        <option value="desc">Mais recentes</option>
        <option value="asc">Mais antigas</option>
      </select>
    </div>
  );
};

export default FiltrosChamadas;