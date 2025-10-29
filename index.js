import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";
import controllers from "./controllers/controller.js"

import data from "./data/index.js";

const app = express();
const PORT = 5001;
const JWT_SECRET = "cors";

app.use(bodyParser.json());
app.use(cors());

// Middleware|
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// Routes
app.get("/tests", (req, res) => {
  console.log('Sí estoy funcionando');
  return res.status(200).json({ status: 'done' });
});

app.post("/signIn", async (req, res) => {
  const { id, password } = req.body;
  const user = data.find((u) => u._id === id);
  if (!user) return res.status(404).json({ message: "User not found" });

  //   const isPasswordValid = await bcrypt.compare(password, user.password);
  //   if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
  res.status(200).json({ token });
});

app.get("/protected", verifyToken, (req, res) => {
  res.status(200).json({ message: "Protected data accessed", user: req.user });
});

app.listen(PORT, () => {
  console.log("Server Listening on PORT: ", PORT);
});

app.get("/tests", (req, res) => {
  console.log('Sí estoy funcionando');
  return res.status(200).json({ status: 'done' });
});

app.get('/users', controllers.getUsers)
app.get('/users/:id', controllers.getUserById)
app.post('/users', controllers.createUser)
app.put('/users/:id', controllers.updateUser)
app.delete('/users/:id', controllers.deleteUser)
