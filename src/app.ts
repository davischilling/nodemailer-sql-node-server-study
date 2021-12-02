import "reflect-metadata";
import express, { json } from "express";
import "express-async-errors";
import { errorHandler } from "./middlewares/errorHandler";
import createConnection from "./database";
import { router } from "./routes/router";

createConnection();

const app = express();
app.use(json());

app.use(router);

app.all("*", async (req, res) => {
  return res.status(404).json({
    error: "Mandou malzão na rota ai cara!",
  });
});

app.use(errorHandler);

export default app;
