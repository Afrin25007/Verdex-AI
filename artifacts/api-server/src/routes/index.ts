import { Router, type IRouter } from "express";
import healthRouter from "./health";
import dashboardRouter from "./dashboard";
import cropDoctorRouter from "./crop-doctor";
import climateRouter from "./climate";
import irrigationRouter from "./irrigation";
import soilRouter from "./soil";
import cropPlannerRouter from "./crop-planner";
import resourceOptimizerRouter from "./resource-optimizer";
import resilienceRouter from "./resilience";
import schemesRouter from "./schemes";
import marketRouter from "./market";
import assistantRouter from "./assistant";

const router: IRouter = Router();

router.use(healthRouter);
router.use(dashboardRouter);
router.use(cropDoctorRouter);
router.use(climateRouter);
router.use(irrigationRouter);
router.use(soilRouter);
router.use(cropPlannerRouter);
router.use(resourceOptimizerRouter);
router.use(resilienceRouter);
router.use(schemesRouter);
router.use(marketRouter);
router.use(assistantRouter);

export default router;
