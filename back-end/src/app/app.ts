import express from "express";
import cors from "cors";
import router from "./router";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://carrinho-seven.vercel.app",
      "https://carrinho-frontend-p78684rdk.vercel.app",
    ],
    credentials: true,
  }),
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(router);

app.get("/", (req, res) => {
  res.json({ message: "Backend funcionando!" });
});

export default app;