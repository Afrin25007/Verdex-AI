import { Router, type IRouter } from "express";
import { RecommendIrrigationBody, RecommendIrrigationResponse } from "@workspace/api-zod";
import { CROPS } from "../lib/agri-data";

const router: IRouter = Router();

const SOIL_RETENTION_FACTOR: Record<string, number> = {
  sandy: 1.25,
  loamy: 1.0,
  clay: 0.85,
  black: 0.9,
  red: 1.1,
  alluvial: 0.95,
};

const SEASON_TIMING: Record<string, string> = {
  kharif: "Early morning (5:30-7:30 AM), reduced frequency during active monsoon spells",
  rabi: "Early morning (6:00-8:00 AM) with a supplemental evening cycle during dry spells",
  zaid: "Split cycles: early morning (5:00-7:00 AM) and evening (6:00-8:00 PM) due to high evaporation",
};

router.post("/irrigation/recommend", (req, res): void => {
  const parsed = RecommendIrrigationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { crop, soilType, landSizeAcres, season } = parsed.data;
  const cropProfile = CROPS.find((c) => c.name === crop) ?? CROPS[0];
  const retention = SOIL_RETENTION_FACTOR[soilType] ?? 1.0;

  const recommendedWaterLitersPerAcre = Math.round(
    (cropProfile.waterNeedLitersPerAcrePerSeason / 4.5) * retention,
  );
  const totalWaterLiters = Math.round(recommendedWaterLitersPerAcre * landSizeAcres);
  const conventionalWaterLiters = Math.round(totalWaterLiters * 1.42);
  const estimatedWaterSavingsPercent = Math.round(
    ((conventionalWaterLiters - totalWaterLiters) / conventionalWaterLiters) * 100,
  );

  const data = RecommendIrrigationResponse.parse({
    bestIrrigationTiming: SEASON_TIMING[season],
    recommendedWaterLitersPerAcre,
    totalWaterLiters,
    conventionalWaterLiters,
    estimatedWaterSavingsPercent,
    groundwaterConservationTip: "Install a drip system with soil moisture sensors to cut deep percolation losses and protect the water table.",
    rainwaterHarvestingTip: "Build a farm pond sized for 15-20% of seasonal water need to capture monsoon runoff for use during dry spells.",
  });
  res.json(data);
});

export default router;
