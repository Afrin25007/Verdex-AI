import { Router, type IRouter } from "express";
import { AskAssistantBody, AskAssistantResponse } from "@workspace/api-zod";
import { answerQuestion } from "../lib/assistant-data";

const router: IRouter = Router();

router.post("/assistant/ask", (req, res): void => {
  const parsed = AskAssistantBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const result = answerQuestion(parsed.data.question);
  res.json(AskAssistantResponse.parse(result));
});

export default router;
