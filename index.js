import dotenv from "dotenv";
import { connectDB } from "./db/conn.js";
import express from "express";
import exphbs from "express-handlebars";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

// Corrige __dirname nos ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

const PORT = 3000;

app.use(express.json());

app.use("/", authRoutes);

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.use(errorHandler);

connectDB();

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
