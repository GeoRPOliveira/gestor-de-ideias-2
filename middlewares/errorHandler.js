export function errorHandler(err, req, res, next) {
  console.error("Erro detectado:", err.stack || err.message);

  if (err.status === 403) {
    return res.status(403).render("error", {
      message: "Acesso negado! Você não tem permissão para realizar esta ação.",
    });
  }

  res.status(500).render("error", {
    message: "Ocorreu um erro interno no servidor. Tente novamente mais tarde.",
  });
}
