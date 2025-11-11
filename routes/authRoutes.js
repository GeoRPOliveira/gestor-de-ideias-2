import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", authController.login);

router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.post("/register", authController.register);

router.get("/logout", authController.logout);

export default router;