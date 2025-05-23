

const autorizar =(...cargosPermitidos) => {
    return (req, res, next) => {
      if (!req.usuario || !cargosPermitidos.includes(req.usuario.cargo)) {
        return res.status(403).json({ erro: 'Acesso não autorizado para este perfil.' });
      }
      next();
    };
  }
  
  module.exports = autorizar;