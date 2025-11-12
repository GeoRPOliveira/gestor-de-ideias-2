import Idea from "../models/Idea.js";
import Vote from "../models/Vote.js";

const ideaController = {
  async showIdeas(req, res) {
    try {
      const ideas = await Idea.find().sort({ createdAt: -1 }).lean();

      console.log("Ideias:", ideas);

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
      const idea = await Idea.findById(id).populate("createdBy", "username").lean();

      if (!idea) return res.status(404).send("Ideia não encontrada");

      const votes = await Vote.find({ ideaId: id }).populate('userId', 'username').lean();

      idea.likes = votes.filter(v => v.type === 'like').map(v => v.userId.username);
      idea.dislikes = votes.filter(v => v.type === 'dislike').map(v => v.userId.username);

      res.render("ideas/details", { idea, user: req.session.user });
    } catch (err) {
      console.error(err);
      res.status(500).send("Erro ao carregar detalhes da ideia.");
    }
  },
};

export default ideaController;
