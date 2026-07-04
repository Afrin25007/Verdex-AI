import { Router, type IRouter } from "express";
import { GetMarketPricesResponse } from "@workspace/api-zod";
import { MARKET_PRICES } from "../lib/market-data";

const router: IRouter = Router();

router.get("/market/prices", (_req, res) => {
  res.json(GetMarketPricesResponse.parse(MARKET_PRICES));
});

export default router;
