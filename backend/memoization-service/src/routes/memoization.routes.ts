import { Router } from "express";

import { memoizationController } from "../controllers/MemoizationController";
import { validate } from "../middlewares/validate";

import { lookupCacheSchema } from "../validators/LookupCacheSchema";
import { storeCacheSchema } from "../validators/StoreCacheSchema";

const router = Router();

router.get(
  "/cache",
  validate(lookupCacheSchema, "query"),
  memoizationController.lookup.bind(
    memoizationController
  )
);

router.post(
  "/cache",
  validate(storeCacheSchema),
  memoizationController.store.bind(
    memoizationController
  )
);

router.delete(
  "/cache/:key",
  memoizationController.invalidate.bind(
    memoizationController
  )
);

export default router;