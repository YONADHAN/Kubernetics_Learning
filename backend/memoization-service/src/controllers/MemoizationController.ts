import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { memoizationService } from "../services/MemoizationService";

import type { CacheStoreRequest } from "../shared/types/CacheStoreRequest";
interface InvalidateParams {
  key: string;
}
export class MemoizationController {
  /**
   * GET /api/v1/cache?key=...
   */
  public async lookup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const key = req.query.key as string;

      const response =
        await memoizationService.lookup(key);

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/cache
   */
  public async store(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const payload =
        req.body as CacheStoreRequest;

      await memoizationService.store(payload);

      res.status(201).json({
        success: true,
        message: "Cache stored successfully.",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/cache/:key
   */

  
  public async invalidate(
    req: Request<InvalidateParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { key } = req.params;

      await memoizationService.invalidate(key);

      res.status(200).json({
        success: true,
        message: "Cache removed successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const memoizationController =
  new MemoizationController();