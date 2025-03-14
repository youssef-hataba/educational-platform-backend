import { Request, Response, NextFunction } from "express";

const asyncHandler = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    //If the function resolves successfully, it proceeds normally. If an error occurs, `.catch(next)` automatically forwards the error to the next middleware (which is usually the global error handler).
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
