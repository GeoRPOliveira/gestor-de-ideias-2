import express from "express";
import voteController from "../controllers/voteController.js";

const router = express.Router();

router.post("/:ideaId", voteController.toggleVote);

export default router;
