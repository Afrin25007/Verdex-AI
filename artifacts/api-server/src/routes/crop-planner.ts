import { Router, type IRouter } from "express";
import { GenerateCropPlanBody, GenerateCropPlanResponse } from "@workspace/api-zod";
import { CROPS, findDistrict, DISTRICTS } from "../lib/agri-data";

const router: IRouter = Router();

const WATER_LEVEL_SCORE: Record<string, number> = { low: 1, medium: 2, high: 3 };
const DEMAND_SCORE: Record<string, number> = { low: 1, moderate: 2, high: 3, very_high: 4 };

router.post("/crop-planner/plan", (req, res): void => {
  const parsed = GenerateCropPlanBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { district: districtName, landSizeAcres, budgetInr, waterAvailability, soilType, season } = parsed.data;
  const district = findDistrict(districtName) ?? DISTRICTS[0];

  const recommendations = CROPS.map((crop) => {
    const investmentInr = Math.round(crop.investmentInrPerAcre * landSizeAcres);
    const expectedIncomeInr = Math.round(crop.yieldQuintalsPerAcre * crop.priceInrPerQuintal * landSizeAcres);
    const profitInr = expectedIncomeInr - investmentInr;

    const zoneMatch = crop.suitableZones.includes(district.climateZone);
    const soilMatch = crop.suitableSoils.includes(soilType);
    const seasonMatch = crop.suitableSeasons.includes(season);
    const affordable = investmentInr <= budgetInr;

    const waterIntensity = crop.waterNeedLitersPerAcrePerSeason / 1_000_000;
    const waterOk = WATER_LEVEL_SCORE[waterAvailability] >= Math.min(3, Math.ceil(waterIntensity / 2.2));

    let matchScore = 0;
    if (zoneMatch) matchScore += 30;
    if (soilMatch) matchScore += 20;
    if (seasonMatch) matchScore += 25;
    if (affordable) matchScore += 15;
    if (waterOk) matchScore += 10;
    matchScore = Math.min(100, matchScore);

    const riskScore = Math.max(
      5,
      Math.min(
        95,
        50 - (zoneMatch ? 15 : 0) - (waterOk ? 10 : -10) - (affordable ? 10 : -15) + (DEMAND_SCORE[crop.marketDemand] <= 2 ? 10 : -5),
      ),
    );

    return {
      crop: crop.name,
      expectedIncomeInr,
      investmentInr,
      profitInr,
      riskScore,
      marketDemand: crop.marketDemand,
      matchScore,
    };
  })
    .sort((a, b) => b.matchScore - a.matchScore || b.profitInr - a.profitInr)
    .slice(0, 6);

  const data = GenerateCropPlanResponse.parse({
    district: district.name,
    recommendations,
  });
  res.json(data);
});

export default router;
