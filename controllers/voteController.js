import Vote from "../models/Vote.js";
import Idea from "../models/Idea.js";
import User from "../models/User.js";

const voteController = {
  async toggleVote(req, res) {
    try {
      const { ideaId } = req.params;

      const sessionUser = req.session.user;
      if (!sessionUser) {
        return res.status(401).send("Usuário não autenticado.");
      }

      const user = await User.findOne({ username: sessionUser.username });
      if (!user) {
        return res.status(401).send("Usuário não encontrado.");
      }

      const userId = user._id;
      const type = "like";

      const ideaExists = await Idea.findById(ideaId);
      if (!ideaExists) return res.status(404).send("Ideia não encontrada.");

      const existingVote = await Vote.findOne({ ideaId, userId });

      if (existingVote) {
        await Vote.findByIdAndDelete(existingVote._id);
      } else {
        const newVote = new Vote({ ideaId, userId, type });
        await newVote.save();
      }

      const voteCount = await Vote.countDocuments({ ideaId, type: "like" });

      res.json({ success: true, voteCount });
    } catch (err) {
      console.error("Erro ao processar voto:", err);
      res.status(500).send("Erro ao processar voto.");
    }
  },
};

export default voteController;
