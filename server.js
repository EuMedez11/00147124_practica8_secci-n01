import express from "express";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(express.json());
app.use("/users", userRoutes);

app.listen(5000, () => console.log("Servidor corriendo en puerto 5000"));
