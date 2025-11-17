import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { PORT } from "./keys/keys.js";

import userRoutes from "./router/router.js";

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/api', userRoutes);


app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);