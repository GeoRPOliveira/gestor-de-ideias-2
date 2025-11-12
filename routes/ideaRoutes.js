import express from "express";
import ideaController from "../controllers/ideaController.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const router = express.Router();

router.get("/", isLoggedIn, ideaController.showIdeas);

router.get("/create", isLoggedIn, ideaController.createIdea);
router.post("/create", isLoggedIn, ideaController.saveIdea);

router.post("/:id/delete", isLoggedIn, ideaController.deleteIdea);

router.get("/:id/edit", isLoggedIn, ideaController.editIdeaForm);
router.post("/:id/edit", isLoggedIn, ideaController.updateIdea);

router.get("/:id", isLoggedIn, ideaController.ideaDetails);

export default router;
