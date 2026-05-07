import { Router } from "express";
import { proxySentinelHubRequest } from "../sentinelHub/proxy.js";

export const sentinelHubRoutes = Router();

sentinelHubRoutes.post("/catalog/search", async (req, res, next) => {
  try {
    const response = await proxySentinelHubRequest("/api/v1/catalog/1.0.0/search", req.body);
    res.type(response.contentType).send(response.body);
  } catch (error) {
    next(error);
  }
});

sentinelHubRoutes.post("/statistics", async (req, res, next) => {
  try {
    const response = await proxySentinelHubRequest("/api/v1/statistics", req.body);
    res.type(response.contentType).send(response.body);
  } catch (error) {
    next(error);
  }
});

sentinelHubRoutes.post("/process", async (req, res, next) => {
  try {
    const response = await proxySentinelHubRequest("/api/v1/process", req.body);
    res.type(response.contentType).send(response.body);
  } catch (error) {
    next(error);
  }
});
