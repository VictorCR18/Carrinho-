import express from "express";
import cors from "cors";
import router from "./router";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://carrinho-seven.vercel.app"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(router);

app.get("/hello", (req, res) => {
  res.json({ message: "Backend funcionando!" });
});

export default app;
