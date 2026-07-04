import { Router, type IRouter } from "express";
import { ListSchemesResponse, MatchSchemesBody, MatchSchemesResponse } from "@workspace/api-zod";
import { SCHEMES, evaluateSchemeEligibility } from "../lib/schemes-data";

const router: IRouter = Router();

router.get("/schemes", (_req, res) => {
  res.json(ListSchemesResponse.parse(SCHEMES));
});

router.post("/schemes/match", (req, res): void => {
  const parsed = MatchSchemesBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const profile = parsed.data;
  const matches = SCHEMES.map((scheme) => {
    const { eligible, reason } = evaluateSchemeEligibility(scheme, profile);
    return { scheme, eligible, matchReason: reason };
  });
  res.json(MatchSchemesResponse.parse(matches));
});

export default router;
