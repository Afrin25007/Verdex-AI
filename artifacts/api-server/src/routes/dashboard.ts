import { Router, type IRouter } from "express";
import { GetPlatformStatsResponse, ListDistrictsResponse } from "@workspace/api-zod";
import { DISTRICTS } from "../lib/agri-data";

const router: IRouter = Router();

router.get("/dashboard/stats", (_req, res) => {
  const data = GetPlatformStatsResponse.parse({
    farmersEmpowered: 128_450,
    districtsCovered: DISTRICTS.length,
    aiPredictionsGenerated: 1_942_310,
    waterSavedLiters: 3_820_000_000,
    carbonReducedKg: 5_640_000,
    asOf: new Date().toISOString(),
  });
  res.json(data);
});

router.get("/dashboard/districts", (_req, res) => {
  const data = ListDistrictsResponse.parse(DISTRICTS);
  res.json(data);
});

export default router;
