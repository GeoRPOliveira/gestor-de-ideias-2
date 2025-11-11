import Idea from "../models/Idea.js";

export async function isAuthor(req, res, next) {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).send("Ideia não encontrada.");
    }

    if (idea.author.toString() !== req.session.userId) {
      return res.status(403).send("Acesso negado. Você não é o autor desta ideia.");
    }

    next();
  } catch (err) {
    console.error("Erro no middleware isAuthor:", err);
    res.status(500).send("Erro interno no servidor.");
  }
}
