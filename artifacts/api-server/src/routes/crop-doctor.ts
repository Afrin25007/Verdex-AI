import { Router, type IRouter } from "express";
import {
  ListDiagnosableCropsResponse,
  DiagnoseCropBody,
  DiagnoseCropResponse,
} from "@workspace/api-zod";
import { CROPS, DISEASES, listSymptomsForCrop } from "../lib/agri-data";

const router: IRouter = Router();

router.get("/crop-doctor/crops", (_req, res) => {
  const crops = CROPS.map((c) => ({
    crop: c.name,
    availableSymptoms: listSymptomsForCrop(c.name),
  }));
  res.json(ListDiagnosableCropsResponse.parse(crops));
});

router.post("/crop-doctor/diagnose", (req, res): void => {
  const parsed = DiagnoseCropBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { crop, symptoms, imageProvided } = parsed.data;

  const candidates = DISEASES.filter((d) => d.crop === crop);
  const pool = candidates.length > 0 ? candidates : DISEASES;

  let best = pool[0];
  let bestMatchCount = -1;
  for (const disease of pool) {
    const matchCount = disease.symptoms.reduce(
      (acc, s) => (symptoms.includes(s) ? acc + 1 : acc),
      0,
    );
    if (matchCount > bestMatchCount) {
      bestMatchCount = matchCount;
      best = disease;
    }
  }

  const symptomRatio = best.symptoms.length > 0 ? bestMatchCount / best.symptoms.length : 0;
  let confidence = Math.round(45 + symptomRatio * 45);
  if (imageProvided) confidence = Math.min(97, confidence + 8);
  confidence = Math.max(35, Math.min(97, confidence));

  const severityScore = Math.min(95, Math.round(best.baseSeverity + symptoms.length * 2));

  const data = DiagnoseCropResponse.parse({
    diseaseName: best.name,
    confidence,
    severityScore,
    description: best.description,
    organicTreatment: best.organicTreatment,
    chemicalTreatment: best.chemicalTreatment,
    recommendedScheme: best.scheme,
    nearestOfficeGuidance: "Visit your nearest Krishi Vigyan Kendra or block agriculture office to confirm diagnosis and access subsidized treatment support.",
    futureRiskNote: severityScore >= 65
      ? "High severity — act within 48 hours to prevent spread to neighboring fields."
      : "Moderate severity — monitor daily and re-check symptoms in 3-5 days.",
  });
  res.json(data);
});

export default router;
