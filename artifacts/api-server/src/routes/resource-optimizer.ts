import { Router, type IRouter } from "express";
import { OptimizeResourcesBody, OptimizeResourcesResponse } from "@workspace/api-zod";
import { CROPS } from "../lib/agri-data";

const router: IRouter = Router();

router.post("/resource-optimizer/optimize", (req, res): void => {
  const parsed = OptimizeResourcesBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { crop, landSizeAcres, currentFertilizerKgPerAcre, currentWaterLitersPerAcre, currentElectricityUnitsPerMonth } = parsed.data;
  const cropProfile = CROPS.find((c) => c.name === crop) ?? CROPS[0];

  const recommendedFertilizerKgPerAcre = cropProfile.benchmarkFertilizerKgPerAcre;
  const recommendedWaterLitersPerAcre = Math.round(cropProfile.waterNeedLitersPerAcrePerSeason / 4.5);
  const recommendedElectricityUnitsPerMonth = cropProfile.benchmarkElectricityUnitsPerMonth;

  const pct = (current: number, recommended: number) =>
    current > 0 ? Math.round(((current - recommended) / current) * 1000) / 10 : 0;

  const fertilizerReductionPercent = Math.max(0, pct(currentFertilizerKgPerAcre, recommendedFertilizerKgPerAcre));
  const waterReductionPercent = Math.max(0, pct(currentWaterLitersPerAcre, recommendedWaterLitersPerAcre));
  const electricityReductionPercent = Math.max(0, pct(currentElectricityUnitsPerMonth, recommendedElectricityUnitsPerMonth));

  const fertilizerSavingsInr = Math.max(0, currentFertilizerKgPerAcre - recommendedFertilizerKgPerAcre) * landSizeAcres * 32;
  const electricitySavingsInr = Math.max(0, currentElectricityUnitsPerMonth - recommendedElectricityUnitsPerMonth) * 6 * 3;
  const estimatedCostSavingsInr = Math.round(fertilizerSavingsInr + electricitySavingsInr);

  const carbonReductionKg = Math.round(
    Math.max(0, currentFertilizerKgPerAcre - recommendedFertilizerKgPerAcre) * landSizeAcres * 1.3 +
      Math.max(0, currentElectricityUnitsPerMonth - recommendedElectricityUnitsPerMonth) * 0.82 * 3,
  );

  const data = OptimizeResourcesResponse.parse({
    recommendedFertilizerKgPerAcre,
    fertilizerReductionPercent,
    recommendedWaterLitersPerAcre,
    waterReductionPercent,
    recommendedElectricityUnitsPerMonth,
    electricityReductionPercent,
    estimatedCostSavingsInr,
    carbonReductionKg,
  });
  res.json(data);
});

export default router;
