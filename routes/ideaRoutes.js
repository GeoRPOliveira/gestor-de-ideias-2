import express from "express";
import ideaController from "../controllers/ideaController.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const router = express.Router();

router.get("/", isLoggedIn, ideaController.showIdeas);

router.get("/create", isLoggedIn, ideaController.createIdea);
router.post("/create", isLoggedIn, ideaController.saveIdea);

router.get("/:id", isLoggedIn, ideaController.ideaDetails);

export default router;
