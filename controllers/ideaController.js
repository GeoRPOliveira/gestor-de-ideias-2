import Idea from "../models/Idea.js";
import Vote from "../models/Vote.js";

const ideaController = {
  async showIdeas(req, res) {
    try {
      const ideas = await Idea.find().sort({ createdAt: -1 }).lean();

      for (let idea of ideas) {
        const votes = await Vote.find({ ideaId: idea._id }).populate('userId', 'username').lean();

        idea.likes = votes.filter(v => v.type === 'like').map(v => v.userId.username);
        idea.dislikes = votes.filter(v => v.type === 'dislike').map(v => v.userId.username);
        idea.isOwner = idea.createdBy === req.session.user.username;
      }

      res.render("ideas/list", { ideas, user: req.session.user });
    } catch (err) {
      console.error(err);
      res.status(500).send("Erro ao carregar ideias.");
    }
  },

  createIdea(req, res) {
    res.render("ideas/create", { user: req.session.user });
  },

  async saveIdea(req, res) {
    try {
      const { title, description, category } = req.body;

      const newIdea = new Idea({
        title,
        description,
        category,
        createdBy: req.session.user.username,
      });

      await newIdea.save();
      res.redirect("/ideas");
    } catch (err) {
      console.error(err);
      res.status(500).send("Erro ao criar ideia.");
    }
  },

  async ideaDetails(req, res) {
    try {
      const { id } = req.params;
      const idea = await Idea.findById(id).lean();

      if (!idea) return res.status(404).send("Ideia não encontrada");

      const votes = await Vote.find({ ideaId: id }).populate('userId', 'username').lean();
      idea.likes = votes.filter(v => v.type === 'like').map(v => v.userId.username);

      res.render("ideas/detail", { idea, user: req.session.user });
    } catch (err) {
      console.error(err);
      res.status(500).send("Erro ao carregar detalhes da ideia.");
    }
  },

  async deleteIdea(req, res) {
    try {
      const { id } = req.params;

      // Busca a ideia pelo ID
      const idea = await Idea.findById(id);

      if (!idea) {
        return res.status(404).send("Ideia não encontrada.");
      }

      // 🔒 Verifica se o usuário logado é o criador
      if (idea.createdBy !== req.session.user.username) {
        return res.status(403).send("Você não tem permissão para excluir esta ideia.");
      }

      // Deleta a ideia
      await Idea.findByIdAndDelete(id);

      console.log(`Ideia ${id} deletada com sucesso por ${req.session.user.username}`);
      res.redirect("/ideas");
    } catch (err) {
      console.error(err);
      res.status(500).send("Erro ao excluir a ideia.");
    }
  },

  async editIdeaForm(req, res) {
    try {
      const { id } = req.params;
      const idea = await Idea.findById(id).lean();

      if (!idea) return res.status(404).send("Ideia não encontrada.");

      // Só o dono pode editar
      if (idea.createdBy !== req.session.user.username) {
        return res.status(403).send("Você não tem permissão para editar esta ideia.");
      }

      res.render("ideas/edit", { idea, user: req.session.user });
    } catch (err) {
      console.error(err);
      res.status(500).send("Erro ao carregar o formulário de edição.");
    }
  },

  async updateIdea(req, res) {
    try {
      const { id } = req.params;
      const { title, description, category } = req.body;

      const idea = await Idea.findById(id);

      if (!idea) return res.status(404).send("Ideia não encontrada.");

      // Confere se o usuário logado é o dono
      if (idea.createdBy !== req.session.user.username) {
        return res.status(403).send("Você não pode editar esta ideia.");
      }

      idea.title = title;
      idea.description = description;
      idea.category = category;

      await idea.save();
      res.redirect("/ideas");
    } catch (err) {
      console.error(err);
      res.status(500).send("Erro ao atualizar a ideia.");
    }
  },

};

export default ideaController;
