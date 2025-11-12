import Vote from "../models/Vote.js";
import Idea from "../models/Idea.js";
import User from "../models/User.js";

const voteController = {
  // Alternar voto (adicionar/remover)
  async toggleVote(req, res) {
    try {
      const { ideaId } = req.params;

      // Busca o usuário logado a partir da sessão
      const sessionUser = req.session.user;
      if (!sessionUser) {
        return res.status(401).send("Usuário não autenticado.");
      }

      // Busca o ID do usuário no banco
      const user = await User.findOne({ username: sessionUser.username });
      if (!user) {
        return res.status(401).send("Usuário não encontrado.");
      }

      const userId = user._id;
      const type = "like"; // nesse caso, sempre like (voto positivo)

      // Confere se a ideia existe
      const ideaExists = await Idea.findById(ideaId);
      if (!ideaExists) return res.status(404).send("Ideia não encontrada.");

      // Verifica se o usuário já votou nessa ideia
      const existingVote = await Vote.findOne({ ideaId, userId });

      if (existingVote) {
        // Se já votou, remove o voto
        await Vote.findByIdAndDelete(existingVote._id);
      } else {
        // Caso contrário, cria o voto
        const newVote = new Vote({ ideaId, userId, type });
        await newVote.save();
      }

      // Conta o total de votos atualizados
      const voteCount = await Vote.countDocuments({ ideaId, type: "like" });

      res.json({ success: true, voteCount });
    } catch (err) {
      console.error("Erro ao processar voto:", err);
      res.status(500).send("Erro ao processar voto.");
    }
  },
};

export default voteController;
