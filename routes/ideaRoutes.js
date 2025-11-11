import express from "express";
import ideaController from "../controllers/ideaController.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { isAuthor } from "../middlewares/isAuthor.js";

const router = express.Router();

router.get("/new", isLoggedIn, (req, res) => res.render("ideas/new"));

router.get("/", isLoggedIn, ideaController.showIdeas);

router.get("/create", isLoggedIn, ideaController.createIdea);

router.post("/create", isLoggedIn, ideaController.saveIdea);

router.get("/:id", isLoggedIn, ideaController.ideaDetails);

// router.get("/:id/edit", isLoggedIn, isAuthor, ideaController.editIdea);

// router.post("/:id/edit", isLoggedIn, isAuthor, ideaController.updateIdea);

// router.post("/:id/delete", isLoggedIn, isAuthor, ideaController.deleteIdea);

router.get("/", ideaController.showIdeas)

export default router;
