import { Router, type IRouter } from "express";
import { CalculateResilienceScoreBody, CalculateResilienceScoreResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const FACTOR_LABELS: Record<string, string> = {
  climateReadiness: "Climate Readiness",
  waterAvailability: "Water Availability",
  cropDiversity: "Crop Diversity",
  soilHealth: "Soil Health",
  financialRisk: "Financial Risk Buffer",
  biodiversity: "Biodiversity",
};

const SUGGESTIONS: Record<string, string> = {
  climateReadiness: "Adopt climate-resilient seed varieties and diversify sowing dates to spread weather risk.",
  waterAvailability: "Invest in drip irrigation and a farm pond to reduce dependency on erratic rainfall.",
  cropDiversity: "Grow at least 3-4 different crops or intercrop to reduce dependence on a single market or weather pattern.",
  soilHealth: "Get a Soil Health Card and apply organic matter to rebuild long-term soil fertility.",
  financialRisk: "Enroll in PMFBY crop insurance and maintain a Kisan Credit Card buffer for input costs.",
  biodiversity: "Maintain field borders with native vegetation and avoid excessive monoculture to support pollinators and natural pest control.",
};

router.post("/resilience/score", (req, res): void => {
  const parsed = CalculateResilienceScoreBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const factors = parsed.data;
  const entries = Object.entries(factors) as Array<[keyof typeof factors, number]>;

  const overallScore = Math.round(
    entries.reduce((sum, [, value]) => sum + value, 0) / entries.length,
  );

  const rating =
    overallScore >= 80 ? "Highly Resilient" :
    overallScore >= 60 ? "Resilient" :
    overallScore >= 40 ? "Moderately Vulnerable" :
    "Highly Vulnerable";

  const sorted = [...entries].sort((a, b) => a[1] - b[1]);
  const weakestFactors = sorted.slice(0, 2).map(([key]) => FACTOR_LABELS[key]);
  const improvementSuggestions = sorted.slice(0, 3).map(([key]) => SUGGESTIONS[key]);

  const data = CalculateResilienceScoreResponse.parse({
    overallScore,
    rating,
    weakestFactors,
    improvementSuggestions,
  });
  res.json(data);
});

export default router;
