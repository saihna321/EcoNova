import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { sentinelHubRoutes } from "./routes/sentinelHubRoutes.js";

const app = express();

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (env.corsOrigins.includes(origin)) return true;

  try {
    const url = new URL(origin);
    const isLocalHost = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    const port = Number(url.port);
    return isLocalHost && port >= 5170 && port <= 5190;
  } catch {
    return false;
  }
}

app.use(cors({
  origin(origin, callback) {
    callback(null, isAllowedOrigin(origin));
  },
}));
app.use(express.json({ limit: "2mb" }));

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "econova-backend" });
});

app.use("/api/sentinel-hub", sentinelHubRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`EcoNova backend running on http://127.0.0.1:${env.port}`);
});
