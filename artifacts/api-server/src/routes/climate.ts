import { Router, type IRouter } from "express";
import { GetClimateForecastBody, GetClimateForecastResponse } from "@workspace/api-zod";
import { DISTRICTS, ZONE_RISK_PROFILE, getSeasonRainMultiplier, findDistrict } from "../lib/agri-data";

const router: IRouter = Router();

router.post("/climate/forecast", (req, res): void => {
  const parsed = GetClimateForecastBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { district: districtName, season } = parsed.data;
  const district = findDistrict(districtName) ?? DISTRICTS[0];
  const risk = ZONE_RISK_PROFILE[district.climateZone];
  const multiplier = getSeasonRainMultiplier(season);

  const rainfall30DayMm = Math.round((district.avgAnnualRainfallMm / 12) * multiplier * 1.15);
  const rainfall7DayMm = Math.round(rainfall30DayMm * 0.28);

  const seasonOutlookByZone: Record<string, string> = {
    arid: "Expect scarce, erratic rainfall with elevated heat stress — prioritize drought-tolerant crops and drip irrigation.",
    "semi-arid": "Moderate rainfall variability expected — plan supplemental irrigation for dry spells within the season.",
    "humid-subtropical": "Regular monsoon activity expected with occasional intense spells — ensure field drainage is in good condition.",
    "coastal-tropical": "High rainfall with cyclone-season vigilance advised — maintain windbreaks and drainage channels.",
    "temperate-hill": "Stable, cooler conditions expected with lower extreme-weather risk this season.",
  };

  const climateResilienceScore = Math.max(
    20,
    Math.min(95, risk.baseResilience + (season === "rabi" ? 6 : season === "zaid" ? -4 : 0)),
  );

  const data = GetClimateForecastResponse.parse({
    district: district.name,
    climateZone: district.climateZone,
    rainfall7DayMm,
    rainfall30DayMm,
    heatwaveRisk: risk.heatwave,
    floodRisk: risk.flood,
    cycloneRisk: risk.cyclone,
    droughtRisk: risk.drought,
    seasonOutlook: seasonOutlookByZone[district.climateZone],
    climateResilienceScore,
  });
  res.json(data);
});

export default router;
