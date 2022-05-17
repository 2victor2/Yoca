import express from "express";
import errorHandler from "./errors/handleError.middleware";

const app = express();

app.use(express.json());

app.use(errorHandler);

export default app;