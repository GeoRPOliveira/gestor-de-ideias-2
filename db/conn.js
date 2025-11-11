import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectDB() {
  try {
    const mongoURI = process.env.MONGO_URL;

    if (!mongoURI) {
      throw new Error("MONGO_URL não definida no arquivo .env");
    }

    await mongoose.connect(mongoURI);
    console.log("Conectado ao MongoDB!");
    mongoose.connection.useDb("idea_manager");
    
  } catch (err) {
    console.error("❌ Erro ao conectar ao MongoDB:", err.message);
    process.exit(1);
  }
}
