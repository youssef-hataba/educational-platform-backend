import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
  res.send("Hello, World! Server is running 🟢");
});

export default app;