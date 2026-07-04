import { Router, type IRouter } from "express";
import { AnalyzeSoilBody, AnalyzeSoilResponse } from "@workspace/api-zod";
import { CROPS } from "../lib/agri-data";

const router: IRouter = Router();

function levelFor(value: number, low: number, high: number): "low" | "medium" | "high" {
  if (value < low) return "low";
  if (value > high) return "high";
  return "medium";
}

router.post("/soil/analyze", (req, res): void => {
  const parsed = AnalyzeSoilBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { nitrogenKgHa, phosphorusKgHa, potassiumKgHa, ph, organicCarbonPercent } = parsed.data;

  const nitrogenLevel = levelFor(nitrogenKgHa, 280, 560);
  const phosphorusLevel = levelFor(phosphorusKgHa, 10, 25);
  const potassiumLevel = levelFor(potassiumKgHa, 110, 280);
  const phStatus = ph < 5.5 ? "acidic" : ph > 8.0 ? "alkaline" : "neutral";
  const organicCarbonStatus = organicCarbonPercent < 0.5 ? "low" : organicCarbonPercent > 0.75 ? "high" : "medium";

  const levelScore: Record<string, number> = { low: 1, medium: 2, high: 3 };
  const fertilityRaw =
    levelScore[nitrogenLevel] + levelScore[phosphorusLevel] + levelScore[potassiumLevel] +
    (organicCarbonStatus === "high" ? 3 : organicCarbonStatus === "medium" ? 2 : 1) +
    (phStatus === "neutral" ? 3 : 1);
  const fertilityRating =
    fertilityRaw >= 13 ? "Excellent" : fertilityRaw >= 10 ? "Good" : fertilityRaw >= 7 ? "Fair" : "Poor";

  const suitableCrops = CROPS.filter((c) => ph >= c.minPh - 0.3 && ph <= c.maxPh + 0.3)
    .slice(0, 5)
    .map((c) => c.name);

  const organicImprovements: string[] = [];
  if (nitrogenLevel === "low") organicImprovements.push("Apply well-decomposed farmyard manure or vermicompost to raise nitrogen levels naturally.");
  if (phosphorusLevel === "low") organicImprovements.push("Use rock phosphate or bone meal compost to improve phosphorus availability.");
  if (potassiumLevel === "low") organicImprovements.push("Apply wood ash or potash-rich compost to boost potassium content.");
  if (phStatus === "acidic") organicImprovements.push("Apply agricultural lime to raise soil pH toward neutral range.");
  if (phStatus === "alkaline") organicImprovements.push("Apply gypsum or organic matter to gradually lower soil pH.");
  if (organicCarbonStatus === "low") organicImprovements.push("Practice green manuring and residue incorporation to rebuild organic carbon.");
  if (organicImprovements.length === 0) organicImprovements.push("Maintain current practices with periodic crop rotation and residue recycling.");

  const expectedYieldUpliftPercent = Math.max(
    3,
    Math.min(35, (4 - fertilityRaw / 4) * 8 + organicImprovements.length * 2),
  );

  const data = AnalyzeSoilResponse.parse({
    fertilityRating,
    nitrogenLevel,
    phosphorusLevel,
    potassiumLevel,
    phStatus,
    organicCarbonStatus,
    suitableCrops,
    organicImprovements,
    expectedYieldUpliftPercent: Math.round(expectedYieldUpliftPercent * 10) / 10,
  });
  res.json(data);
});

export default router;
