import express from "express";
import voteController from "../controllers/voteController.js";

const router = express.Router();

// Votar (toggle)
router.post("/:ideaId", voteController.toggleVote);

export default router;
